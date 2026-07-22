import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { getUploadContentType, isUploadedFile, saveUploadedImage, UPLOAD_URL_PREFIX } from "./uploads";

describe("uploads", () => {
  it("detects uploaded file-like values without depending on the File realm", () => {
    assert.equal(
      isUploadedFile({
        name: "hero-photo.jpg",
        type: "image/jpeg",
        size: 3,
        arrayBuffer: async () => new ArrayBuffer(3)
      }),
      true
    );
    assert.equal(isUploadedFile("hero-photo.jpg"), false);
  });

  it("saves uploads in the configured directory and returns the runtime route URL", async () => {
    const previousUploadDir = process.env.UPLOAD_DIR;
    const uploadDir = await mkdtemp(path.join(os.tmpdir(), "muhlenbruch-uploads-"));
    const buffer = new ArrayBuffer(3);
    new Uint8Array(buffer).set([1, 2, 3]);

    process.env.UPLOAD_DIR = uploadDir;

    try {
      const uploadUrl = await saveUploadedImage({
        name: "Hero Photo.JPG",
        type: "image/jpeg",
        size: buffer.byteLength,
        arrayBuffer: async () => buffer
      });

      assert.match(uploadUrl, new RegExp(`^${UPLOAD_URL_PREFIX}/\\d+-[0-9a-f-]+-hero-photo\\.jpg$`));

      const savedName = uploadUrl.slice(`${UPLOAD_URL_PREFIX}/`.length);
      const savedFile = await readFile(path.join(uploadDir, savedName));

      assert.deepEqual([...savedFile], [1, 2, 3]);
    } finally {
      if (previousUploadDir === undefined) {
        delete process.env.UPLOAD_DIR;
      } else {
        process.env.UPLOAD_DIR = previousUploadDir;
      }

      await rm(uploadDir, { recursive: true, force: true });
    }
  });

  it("resolves upload content types by file extension", () => {
    assert.equal(getUploadContentType("photo.WEBP"), "image/webp");
    assert.equal(getUploadContentType("unknown.bin"), "application/octet-stream");
  });
});
