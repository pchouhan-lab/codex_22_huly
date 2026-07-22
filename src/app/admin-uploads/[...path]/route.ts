import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadContentType, getUploadDir } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function resolveUploadPath(parts: string[] = []) {
  if (
    parts.length === 0 ||
    parts.some((part) => !part || part === "." || part === ".." || part.includes("/") || part.includes("\\"))
  ) {
    return null;
  }

  const uploadDir = getUploadDir();
  const uploadPath = path.resolve(uploadDir, ...parts);
  const relativePath = path.relative(uploadDir, uploadPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return uploadPath;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { path: pathParts } = await params;
  const uploadPath = resolveUploadPath(pathParts);

  if (!uploadPath) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const [file, fileStat] = await Promise.all([readFile(uploadPath), stat(uploadPath)]);

    if (!fileStat.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
        "Content-Type": getUploadContentType(uploadPath),
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
