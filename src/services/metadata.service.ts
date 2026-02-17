import fs from "fs";
import path from "path";
import { Mutex } from "async-mutex";

export interface MetadataEntry {
  id: string;
  fileName: string;
  originalName: string;
  hash: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  folder: string;
}

export class MetadataService {
  private metadataPath: string;
  private static mutex = new Mutex();

  constructor(metadataPath?: string) {
    this.metadataPath = metadataPath || path.join(process.cwd(), "metadata.json");
    this.ensureFile();
  }

  private ensureFile() {
    if (!fs.existsSync(this.metadataPath)) {
      fs.writeFileSync(this.metadataPath, JSON.stringify({ files: [] }, null, 2));
    }
  }

  async getAll(): Promise<MetadataEntry[]> {
    this.ensureFile();
    const data = await fs.promises.readFile(this.metadataPath, "utf-8");
    return JSON.parse(data).files || [];
  }

  async saveAll(files: MetadataEntry[]) {
    await fs.promises.writeFile(this.metadataPath, JSON.stringify({ files }, null, 2));
  }

  async add(entry: MetadataEntry) {
    await MetadataService.mutex.runExclusive(async () => {
      const files = await this.getAll();
      files.push(entry);
      await this.saveAll(files);
    });
  }

  async removeById(id: string) {
  await MetadataService.mutex.runExclusive(async () => {
    const files = (await this.getAll()).filter((f) => f.id !== id);
    await this.saveAll(files);
  });
}

  async findById(id: string) {
    return (await this.getAll()).find((f) => f.id === id);
  }

  async findByHash(hash: string) {
    return (await this.getAll()).find((f) => f.hash === hash);
  }
}
