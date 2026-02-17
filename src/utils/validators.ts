import { FileObject } from "../types";
import path from "path";

// Custom error class for validation errors
export class ValidationError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateFile(file: FileObject, maxSize = 1 * 1024 * 1024) {
  // Check file object exists
  if (!file) {
    throw new ValidationError(400, "File object is required");
  }

  // Check buffer exists
  if (!file.buffer) {
    throw new ValidationError(400, "Invalid file buffer: file content is missing");
  }

  // Check MIME type
  if (!file.mimeType) {
    throw new ValidationError(400, "Missing MIME type: file type not detected");
  }

  // Check file size is valid
  if (file.size <= 0) {
    throw new ValidationError(400, "Invalid file size: file appears to be empty");
  }

  // Check file size doesn't exceed limit
  if (file.size > maxSize) {
    console.log(file.size)
    throw new ValidationError(
      413,
      "File too large"
    );
  }

  // Check file extension exists
  const ext = path.extname(file.originalName);
  if (!ext) {
    throw new ValidationError(
      400,
      "File extension missing: cannot determine file type from filename"
    );
  }

  // Normalize extension to lowercase
  const normalizedExt = ext.toLowerCase();

  // Block dangerous extensions FIRST (security-critical)
  if (blockExtensions.includes(normalizedExt)) {
    throw new ValidationError(
      400,
      `File type not allowed: ${normalizedExt} files are blocked for security reasons`
    );
  }

  // Enforce allowlist (only allow specific types)
  if (!allowedExtensions.includes(normalizedExt)) {
    throw new ValidationError(
      400,
      `Unsupported file type: ${normalizedExt} is not in the list of allowed types`
    );
  }
}


export const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".txt",
  ".zip"
];

export const blockExtensions = [
".exe",
".bat",
".cmd",
".sh",
".js",
".ts",
".php",
".html",
".svg",
".msi",
".dll"
];


