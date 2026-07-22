"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button className="admin-icon-button" type="button" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      <LogOut size={17} aria-hidden="true" />
      Sign out
    </button>
  );
}
