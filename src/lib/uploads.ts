import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const imageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"]
]);

function sanitizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function saveUploadedImage(file: File | null, existingValue = "") {
  if (!file || file.size === 0) {
    return existingValue;
  }

  const extension = imageTypes.get(file.type);
  if (!extension) {
    throw new Error("Only JPG, PNG, WebP, GIF, and SVG uploads are supported.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const baseName = sanitizeName(file.name.replace(/\.[^.]+$/, "")) || "upload";
  const fileName = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;
  const destination = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(destination, buffer);
  return `/uploads/${fileName}`;
}
