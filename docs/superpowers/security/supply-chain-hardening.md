# Supply-chain hardening

How this proposal site defends against malicious or compromised npm packages. Applies to every developer install, every CI install, every Vercel build.

## Runtime requirements

- **Node.js 22+** (24 recommended; what's pinned today).
- **pnpm** — current major; pinned in `package.json` via the `packageManager` field. Activated through Corepack — do not install pnpm separately.

```bash
corepack enable                # one-time per machine
# pnpm is now on PATH; version is whatever's pinned in package.json
```

## Setup on a fresh machine

```bash
corepack enable
npm install --global sfw       # Socket Firewall Free — package fetch inspection
sfw pnpm install --frozen-lockfile
```

Do not run plain `npm install`, `pnpm install`, `pnpm add ...`, `pnpm dlx ...`, `npx ...` here. Always prefix with `sfw` when the command will fetch packages from the registry.

## When to use `sfw` and when not to

Wrap with `sfw` — these commands fetch packages:

| ✓ | Command |
|---|---|
| ✓ | `sfw pnpm install` |
| ✓ | `sfw pnpm install --frozen-lockfile` |
| ✓ | `sfw pnpm add <package>` |
| ✓ | `sfw pnpm update` |
| ✓ | `sfw pnpm dlx <package> ...` |
| ✓ | `sfw npx <package> ...` |

Run as-is — these only execute already-installed local tools:

| | Command |
|---|---|
| | `pnpm run build` (or `pnpm build`) |
| | `pnpm run lint` |
| | `pnpm exec <local-bin>` |

## What's in `pnpm-workspace.yaml`

Five hardening settings, plus two review-gated lists.

| Setting | Value | Why |
|---|---|---|
| `minimumReleaseAge` | `1440` (minutes = 24h) | Resolve only versions ≥24h old. Most malicious npm publishes get yanked within that window. |
| `trustPolicy` | `no-downgrade` | Reject versions whose publish trust evidence regresses from older releases. |
| `blockExoticSubdeps` | `true` | Block transitive `git:` deps and direct tarball deps. |
| `strictDepBuilds` | `true` | Fail install if any dep wants to run a lifecycle script that hasn't been reviewed. |
| `savePrefix` | `""` | New deps saved as exact versions, not `^X.Y.Z` ranges. |
| `allowBuilds` | reviewed allowlist | Pinned `package@version` entries that may run install scripts. |
| `minimumReleaseAgeExclude` | reviewed exception list | Pinned `package@version` entries exempt from the 24h delay. |

## Adding or upgrading a dependency

```bash
sfw pnpm add <package>             # production dep
sfw pnpm add -D <package>          # dev dep
```

What can go wrong, and the playbook for each:

### `ERR_PNPM_MIN_RELEASE_AGE_NOT_MET` — version too fresh

The version you're trying to install was published less than 24h ago. **Prefer waiting.** If genuinely urgent and you've reviewed the change, add a narrow exception to `pnpm-workspace.yaml`:

```yaml
minimumReleaseAgeExclude:
  - "package-name@1.2.3"   # why / reviewed-by / remove-by date
```

Always pin to the exact version, not the package. Always include a comment naming who reviewed and a date the entry should be removed (typically: when you next bump the dep).

### `ERR_PNPM_IGNORED_BUILDS` — dep has lifecycle scripts

A new (or upgraded) dep declares `preinstall`/`install`/`postinstall`. pnpm will not run them until you review and allow:

1. Find why it's in the tree: `pnpm why <package> --recursive --depth 8`.
2. Locate the script:
   ```bash
   node -e "const p=require.resolve('<package>/package.json'); console.log(p)"
   ```
   Open the `package.json` and read the scripts. Read any files those scripts reference.
3. Decide:
   - `true` — package needs the script for runtime or build correctness.
   - `false` — package works without the script (often it's a funding banner or version warning).

4. Add the verdict to `pnpm-workspace.yaml`:
   ```yaml
   allowBuilds:
     "sharp@0.34.5": true
     "core-js@3.30.0": false
   ```

5. Re-run `CI=true sfw pnpm install --frozen-lockfile`.

Common-case quick reference (per the hardening plan):

| Package | Usually | Why |
|---|---|---|
| `esbuild` | allow | Validates platform-specific binary. Build depends on it. |
| `sharp` | allow | Validates native image-processing deps. |
| `unrs-resolver` | allow | Rust-based resolver used by eslint-plugin-import. |
| `core-js` | deny | Prints funding/support banner; no runtime impact. |
| `msw` | deny | Unless you rely on install-time worker generation. |
| `protobufjs` | deny | Emits version-range warnings; no runtime impact. |

When in doubt, deny first and verify the build still works.

## Where this gets enforced

- **Local dev** — pnpm reads `pnpm-workspace.yaml` on every install.
- **Vercel builds** — `vercel.json` sets `installCommand` to `corepack enable && npm install --global sfw && sfw pnpm install --frozen-lockfile`. The leading `corepack enable` is load-bearing: Vercel's build container ships with an old default pnpm (~v6) that can't read pnpm 11+ lockfiles. Overriding `installCommand` bypasses Vercel's normal `packageManager` detection, so we must enable Corepack ourselves to activate the pinned version. Same policy applies, plus the firewall.
- **CI (GitHub Actions, if/when we add it)** — install `sfw` before `pnpm install --frozen-lockfile`.

If you change `pnpm-workspace.yaml`, also run `CI=true sfw pnpm install --frozen-lockfile` locally before committing — the lockfile and the policy must agree.

## Threat model — what this catches and what it doesn't

**Catches**
- Newly published malicious or hijacked package versions (24h delay window).
- Trust regressions (e.g. dep republished under a different account).
- Transitive `git:` and tarball deps smuggling unaudited code.
- Unreviewed install-time scripts (the most common malware execution vector on npm).
- Accidental dep version drift (exact-version save + frozen-lockfile installs).

**Doesn't catch**
- Long-standing malicious code in a stable, well-aged package (`minimumReleaseAge` doesn't help here — read the diff before adding).
- Compromise at the package manager binary itself (Corepack pins the pnpm hash, which helps).
- Runtime-only attacks (network requests in legitimate runtime code that exfiltrate data).
- The first dep you add — `sfw` only flags what its policy/intel knows about; new attacker domains take time to land in intel.

## Process for adding a brand-new top-level dep

1. Check the package on npm — last publish date, weekly downloads, GitHub repo, recent issues.
2. `sfw pnpm add <package>` — Socket Firewall will warn on anything its intel knows about.
3. If install fails due to `minimumReleaseAge` or `strictDepBuilds`, follow the playbooks above.
4. Run `pnpm build` to confirm nothing broke.
5. Commit the new entry in `package.json` + the updated `pnpm-lock.yaml` together. Don't split.
