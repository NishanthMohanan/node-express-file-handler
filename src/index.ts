import { FileHandler } from "./file-handler";
import { LocalStorageService } from "./services/local-storage.service";
import { MetadataService } from "./services/metadata.service";
import { createFileRoutes } from "./routes";
import createUploadHandlers, { createUploadHandlers as createUploadHandlersNamed } from "./middleware/multer.middleware";

export { FileHandler };
export { LocalStorageService };
export { MetadataService };
export { createFileRoutes };
export { createUploadHandlersNamed as createUploadHandlers };
export * from "./types";

// Convenience default export
const defaultExport = {
  FileHandler,
  LocalStorageService,
  MetadataService,
  createFileRoutes,
  createUploadHandlers: createUploadHandlersNamed,
};

export default defaultExport;
