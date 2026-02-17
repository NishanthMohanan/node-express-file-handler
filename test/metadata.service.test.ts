import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { MetadataService, MetadataEntry } from "../src/services/metadata.service";

describe("MetadataService", () => {
  let tempMetadataPath: string;
  let service: MetadataService;

  beforeEach(() => {
    tempMetadataPath = path.join(__dirname, `metadata-${Date.now()}.json`);
    service = new MetadataService(tempMetadataPath);
  });

  afterEach(() => {
    if (fs.existsSync(tempMetadataPath)) {
      fs.unlinkSync(tempMetadataPath);
    }
  });

  it("should create metadata file on init", () => {
    expect(fs.existsSync(tempMetadataPath)).toBe(true);
  });

  it("should add a metadata entry", async () => {
    const entry: MetadataEntry = {
      id: "file-1",
      fileName: "file-1.txt",
      originalName: "test.txt",
      hash: "abc123",
      size: 100,
      mimeType: "text/plain",
      uploadedAt: new Date().toISOString(),
      folder: "",
    };

    await service.add(entry);
    const all = await service.getAll();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe("file-1");
  });

  it("should find entry by id", async () => {
    const entry: MetadataEntry = {
      id: "file-2",
      fileName: "file-2.txt",
      originalName: "test2.txt",
      hash: "def456",
      size: 200,
      mimeType: "text/plain",
      uploadedAt: new Date().toISOString(),
      folder: "",
    };

    await service.add(entry);
    const found = await service.findById("file-2");
    expect(found?.id).toBe("file-2");
  });

  it("should find entry by hash", async () => {
    const entry: MetadataEntry = {
      id: "file-3",
      fileName: "file-3.txt",
      originalName: "test3.txt",
      hash: "ghi789",
      size: 300,
      mimeType: "text/plain",
      uploadedAt: new Date().toISOString(),
      folder: "",
    };

    await service.add(entry);
    const found = await service.findByHash("ghi789");
    expect(found?.id).toBe("file-3");
  });

  it("should remove entry by id", async () => {
    const entry: MetadataEntry = {
      id: "file-4",
      fileName: "file-4.txt",
      originalName: "test4.txt",
      hash: "jkl012",
      size: 400,
      mimeType: "text/plain",
      uploadedAt: new Date().toISOString(),
      folder: "",
    };

    await service.add(entry);
    await service.removeById("file-4");
    const all = await service.getAll();
    expect(all).toHaveLength(0);
  });
});
