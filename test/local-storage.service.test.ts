import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { LocalStorageService } from "../src/services/local-storage.service";
import { MetadataService } from "../src/services/metadata.service";
import { FileObject } from "../src/types";

describe("LocalStorageService", () => {
  let tempUploadDir: string;
  let tempMetadataPath: string;
  let service: LocalStorageService;
  let metadataService: MetadataService;

  beforeEach(() => {
    tempUploadDir = path.join(__dirname, `uploads-${Date.now()}`);
    tempMetadataPath = path.join(__dirname, `metadata-${Date.now()}.json`);

    if (!fs.existsSync(tempUploadDir)) {
      fs.mkdirSync(tempUploadDir, { recursive: true });
    }

    metadataService = new MetadataService(tempMetadataPath);
    service = new LocalStorageService(tempUploadDir, metadataService);
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

  it("should upload a file", async () => {
    const file: FileObject = {
      originalName: "test.txt",
      mimeType: "text/plain",
      size: 10,
      buffer: Buffer.from("hello test"),
    };

    const result = await service.upload(file);

    expect(result.id).toBeDefined();
    expect(result.originalName).toBe("test.txt");
    expect(result.mimeType).toBe("text/plain");
    expect(result.duplicate).toBeUndefined();

    const filePath = path.join(tempUploadDir, `${result.id}.txt`);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("should detect duplicate files by hash", async () => {
    const buffer = Buffer.from("same content");

    const file1: FileObject = {
      originalName: "file1.txt",
      mimeType: "text/plain",
      size: buffer.length,
      buffer,
    };

    const file2: FileObject = {
      originalName: "file2.txt",
      mimeType: "text/plain",
      size: buffer.length,
      buffer,
    };

    const result1 = await service.upload(file1);
    const result2 = await service.upload(file2);

    // On duplicate, the same ID is returned with a duplicate flag
    expect(result2.duplicate).toBe(true);
    expect(result2.id).toBe(result1.id);
  });

  it("should delete a file", async () => {
    const file: FileObject = {
      originalName: "delete-me.txt",
      mimeType: "text/plain",
      size: 11,
      buffer: Buffer.from("delete test"),
    };

    const result = await service.upload(file);

    // Find the actual file (it includes the extension from originalName)
    const files = fs.readdirSync(tempUploadDir);
    const uploadedFile = files.find((f) => f.startsWith(result.id));
    expect(uploadedFile).toBeDefined();

    const filePath = path.join(tempUploadDir, uploadedFile!);
    expect(fs.existsSync(filePath)).toBe(true);

    await service.delete(result.id);

    expect(fs.existsSync(filePath)).toBe(false);

    // Metadata should also be removed
    const metadata = await metadataService.findById(result.id);
    expect(metadata).toBeUndefined();
  });

  it("should throw when deleting non-existent file", async () => {
    await expect(service.delete("non-existent-id")).rejects.toThrow("File not found");
  });
});
