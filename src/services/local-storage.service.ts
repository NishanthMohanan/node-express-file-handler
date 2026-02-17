import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { FileObject, UploadResult } from "../types";
import { ensureDir } from "../utils/file-utils";
import { generateContentHash } from "../utils/file-utils";
import { MetadataService, MetadataEntry } from "./metadata.service";

export class LocalStorageService {
  private metadataService: MetadataService;
  private getSafeFolder(folder?: string): string {
    const raw = folder || "";
    const safe = path.normalize(raw).replace(/^(\.\.(\/|\\|$))+/, "");
    return safe || "";
  }

  constructor(private uploadDir: string, metadataService?: MetadataService) {
    this.metadataService = metadataService || new MetadataService();
    ensureDir(this.uploadDir);
  }

  async upload(file: FileObject, uploadDir?: string): Promise<UploadResult> {


    //Duplication block

    const hash = generateContentHash(file.buffer);
    // // Duplicate check
    // const duplicate = await this.metadataService.findByHash(hash);
    // if (duplicate) {
    //   console.log("duplicate found");
    //   return {
    //     id: duplicate.id,
    //     originalName: file.originalName,
    //     mimeType: file.mimeType,
    //     size: file.size,
    //     duplicate: true,
    //     folder: duplicate.folder,
    //   };
    // }

    const id = file.id || uuidv4();
    const ext = path.extname(file.originalName);
    const fileName = `${id}${ext}`;
    // Determine folder
    const safeFolder = this.getSafeFolder(uploadDir || file.folder);
    console.log("Safe folder:", safeFolder);
    // Create folder if not exists
    const folderPath = path.join(this.uploadDir, safeFolder);
    await ensureDir(folderPath);
    console.log("Final folderPath:", folderPath);

    // Save file in folder
    const filePath = path.join(folderPath, fileName);
    console.log("Final filePath:", filePath);
    await fs.promises.writeFile(filePath, file.buffer);
    await this.metadataService.add({
      id,
      fileName,
      originalName: file.originalName,
      hash,
      size: file.size,
      mimeType: file.mimeType,
      uploadedAt: new Date().toISOString(),
      folder: safeFolder
    } as MetadataEntry);

    return {
      id,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      folder: safeFolder,
    };
  }

  async delete(id: string): Promise<void> {
    const metadata = await this.metadataService.findById(id);
    if (!metadata) throw new Error("File not found");
    const filePath = path.join(this.uploadDir, metadata.folder || "", metadata.fileName);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    await this.metadataService.removeById(id);
  }
}
