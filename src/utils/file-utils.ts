import crypto from "crypto";
import path from "path";

//creates a unique random file name to avoid conflicts
export function generateRandomName(originalName: string): string {
  const ext = path.extname(originalName);
  const random = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${random}${ext}`;
}

//Creates directory if it doesn't exist
export async function ensureDir(dirPath: string) {
  const fs = require("fs/promises");
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error("Failed to create directory:", err);
    throw err;
  }
} 

export function generateContentHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}