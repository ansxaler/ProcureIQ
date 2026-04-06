"use client";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rocket body */}
      <path
        d="M32 4C32 4 16 20 16 40C16 48 20 54 32 60C44 54 48 48 48 40C48 20 32 4 32 4Z"
        fill="#7eb8da"
        opacity="0.9"
      />
      {/* Window */}
      <circle cx="32" cy="28" r="6" fill="#0f1729" />
      <circle cx="32" cy="28" r="4" fill="#3d5a80" />
      {/* Left fin */}
      <path d="M16 40L8 52L16 48Z" fill="#5b7faa" />
      {/* Right fin */}
      <path d="M48 40L56 52L48 48Z" fill="#5b7faa" />
      {/* Exhaust */}
      <ellipse cx="32" cy="58" rx="4" ry="2" fill="#f59e0b" opacity="0.8" />
    </svg>
  );
}
