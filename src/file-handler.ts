import { LocalStorageService } from "./services/local-storage.service";
import { FileObject, UploadResult } from "./types";
import { validateFile } from "./utils/validators";
import { MetadataService } from "./services/metadata.service";

export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

export class FileHandler {
  private storage: LocalStorageService;

  constructor(uploadDir: string, metadataService?: MetadataService) {
    this.storage = new LocalStorageService(uploadDir, metadataService);
  }

  async upload(
    file: FileObject,
    uploadDir?: string,
    maxSize?: number
  ): Promise<UploadResult> {

    const effectiveMaxSize = maxSize ?? DEFAULT_MAX_FILE_SIZE;

    validateFile(file, effectiveMaxSize);

    return this.storage.upload(file, uploadDir);
  }

  async delete(id: string): Promise<void> {
    return this.storage.delete(id);
  }
}
//ok