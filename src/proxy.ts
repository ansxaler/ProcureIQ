import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "onjob!";
const COOKIE_NAME = "procureiq-auth";

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Return a simple login page
  return new NextResponse(loginHTML(), {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function loginHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ProcureIQ — Access</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0a0f1a; color: #fff; font-family: system-ui, -apple-system, sans-serif;
    }
    .card {
      background: #111827; border: 1px solid #1e293b; border-radius: 16px;
      padding: 48px; width: 100%; max-width: 400px; text-align: center;
    }
    .logo { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .logo span { color: #3b82f6; }
    .sub { color: #64748b; font-size: 13px; margin-bottom: 32px; }
    input {
      width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid #1e293b;
      background: #0a0f1a; color: #fff; font-size: 15px; outline: none;
      margin-bottom: 16px; text-align: center; letter-spacing: 2px;
    }
    input:focus { border-color: #3b82f6; }
    button {
      width: 100%; padding: 12px; border-radius: 10px; border: none;
      background: #3b82f6; color: #fff; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
    }
    button:hover { background: #2563eb; }
    .error { color: #ef4444; font-size: 13px; margin-top: 12px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Procure<span>IQ</span></div>
    <p class="sub">Enter password to continue</p>
    <form onsubmit="return handleSubmit(event)">
      <input type="password" id="pw" placeholder="••••••" autofocus />
      <button type="submit">Enter</button>
    </form>
    <p class="error" id="err">Incorrect password</p>
  </div>
  <script>
    async function handleSubmit(e) {
      e.preventDefault();
      const pw = document.getElementById('pw').value;
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        document.getElementById('err').style.display = 'block';
        document.getElementById('pw').value = '';
        document.getElementById('pw').focus();
      }
    }
  </script>
</body>
</html>`;
}
