"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button className="admin-primary-button" type="button" onClick={() => signIn("google", { callbackUrl: "/admin" })}>
      Sign in with Google
    </button>
  );
}
