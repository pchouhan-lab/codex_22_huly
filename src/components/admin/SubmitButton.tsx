"use client";

import { Save } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Save Changes" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="admin-primary-button" type="submit" disabled={pending}>
      <Save size={17} aria-hidden="true" />
      {pending ? "Saving..." : label}
    </button>
  );
}
