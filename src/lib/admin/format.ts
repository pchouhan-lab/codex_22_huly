import type { AdminField } from "@/lib/admin/config";
import { parseJsonArray } from "@/lib/content";

export function valueToTextarea(field: AdminField, value: unknown) {
  if (field.type === "stringList") {
    return parseJsonArray<string>(String(value ?? ""), []).join("\n");
  }

  if (field.type === "linkList") {
    return parseJsonArray<{ label: string; href: string }>(String(value ?? ""), [])
      .map((item) => `${item.label} | ${item.href}`)
      .join("\n");
  }

  return String(value ?? "");
}

export function formatAdminValue(value: unknown) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value ?? "");
}
