"use client";

import { useEffect, useState } from "react";

const callbackUrl = "/admin";

export function LoginButton() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCsrfToken() {
      const response = await fetch("/api/auth/csrf");
      const payload = (await response.json().catch(() => ({}))) as { csrfToken?: string };

      if (active && payload.csrfToken) {
        setCsrfToken(payload.csrfToken);
      }
    }

    loadCsrfToken();

    return () => {
      active = false;
    };
  }, []);

  return (
    <form action="/api/auth/signin/google" method="post">
      <input type="hidden" name="csrfToken" value={csrfToken} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <button className="admin-primary-button" type="submit" disabled={!csrfToken}>
        {csrfToken ? "Sign in with Google" : "Preparing sign in..."}
      </button>
    </form>
  );
}
