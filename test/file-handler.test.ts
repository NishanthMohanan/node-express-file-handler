import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { FileHandler } from "../src/file-handler";
import { MetadataService } from "../src/services/metadata.service";
import { FileObject } from "../src/types";

describe("FileHandler", () => {
  let tempUploadDir: string;
  let tempMetadataPath: string;
  let handler: FileHandler;
  let metadataService: MetadataService;

  beforeEach(() => {
    tempUploadDir = path.join(__dirname, `uploads-${Date.now()}`);
    tempMetadataPath = path.join(__dirname, `metadata-${Date.now()}.json`);

    if (!fs.existsSync(tempUploadDir)) {
      fs.mkdirSync(tempUploadDir, { recursive: true });
    }

    metadataService = new MetadataService(tempMetadataPath);
    handler = new FileHandler(tempUploadDir, metadataService);
  });

  afterEach(() => {
    try {
      if (fs.existsSync(tempUploadDir)) {
        fs.rmSync(tempUploadDir, { recursive: true });
      }
    } catch (err) {
      // Ignore cleanup errors
    }
    try {
      if (fs.existsSync(tempMetadataPath)) {
        fs.unlinkSync(tempMetadataPath);
      }
    } catch (err) {
      // Ignore cleanup errors
    }
  });

  it("should upload a file with validation", async () => {
    const file: FileObject = {
      originalName: "document.pdf",
      mimeType: "application/pdf",
      size: 5000,
      buffer: Buffer.alloc(5000),
    };

    const result = await handler.upload(file, 10 * 1024 * 1024); // 10MB limit

    expect(result.id).toBeDefined();
    expect(result.originalName).toBe("document.pdf");
    expect(result.mimeType).toBe("application/pdf");
  });

  it("should reject files exceeding max size", async () => {
    const file: FileObject = {
      originalName: "large.bin",
      mimeType: "application/octet-stream",
      size: 2 * 1024 * 1024, // 2MB
      buffer: Buffer.alloc(2 * 1024 * 1024),
    };

    // Enforce 1MB max
    await expect(handler.upload(file, 1 * 1024 * 1024)).rejects.toThrow("File too large");
  });

  it("should delete a file", async () => {
    const file: FileObject = {
      originalName: "remove.txt",
      mimeType: "text/plain",
      size: 100,
      buffer: Buffer.alloc(100),
    };

    const result = await handler.upload(file);

    const filePath = path.join(tempUploadDir, `${result.id}.txt`);
    expect(fs.existsSync(filePath)).toBe(true);

    await handler.delete(result.id);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("should throw on invalid file", async () => {
    const invalidFile: FileObject = {
      originalName: "test.txt",
      mimeType: "", // Missing mime type
      size: 100,
      buffer: Buffer.alloc(100),
    };

    await expect(handler.upload(invalidFile)).rejects.toThrow("Missing mime type");
  });
});
