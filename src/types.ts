// src/types.ts
export interface FileObject {
  id?: string;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  folder?: string;
}
export interface UploadResult {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  duplicate?: boolean;
  folder: string;
}

export interface FileHandlerOptions {
  uploadDir?: string;
}
