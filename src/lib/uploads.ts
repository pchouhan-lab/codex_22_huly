import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const UPLOAD_URL_PREFIX = "/admin-uploads";
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type UploadedImageFile = {
  name: string;
  type: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

const imageExtensionsByType = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"]
]);

const imageContentTypesByExtension = new Map(
  [...imageExtensionsByType.entries()].map(([contentType, extension]) => [extension, contentType])
);

function sanitizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extensionFor(file: UploadedImageFile) {
  const contentType = file.type.toLowerCase();
  const extensionFromType = imageExtensionsByType.get(contentType);

  if (extensionFromType) {
    return extensionFromType;
  }

  const extensionFromName = path.extname(file.name).toLowerCase();
  return imageContentTypesByExtension.has(extensionFromName) ? extensionFromName : null;
}

export function isUploadedFile(value: unknown): value is UploadedImageFile {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<UploadedImageFile>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.type === "string" &&
    typeof candidate.size === "number" &&
    typeof candidate.arrayBuffer === "function"
  );
}

export function getUploadDir() {
  const configuredDir = process.env.UPLOAD_DIR?.trim();
  return configuredDir ? path.resolve(configuredDir) : path.join(process.cwd(), "public", "uploads");
}

export function getUploadContentType(filePath: string) {
  return imageContentTypesByExtension.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

export async function saveUploadedImage(file: UploadedImageFile | null, existingValue = "") {
  if (!file || file.size === 0) {
    return existingValue;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Images must be 10 MB or smaller.");
  }

  const extension = extensionFor(file);
  if (!extension) {
    throw new Error("Only JPG, PNG, WebP, GIF, and SVG uploads are supported.");
  }

  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const baseName = sanitizeName(file.name.replace(/\.[^.]+$/, "")) || "upload";
  const fileName = `${Date.now()}-${randomUUID()}-${baseName}${extension}`;
  const destination = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(destination, buffer);
  return `${UPLOAD_URL_PREFIX}/${fileName}`;
}
