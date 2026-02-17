// import { fileTypeFromBuffer } from "file-type";
// import path from "path";

// export interface TempFileObject {
//   originalName: string;
//   size: number;
//   buffer: Buffer;
// }

// interface ValidateResult {
//   detectedExt: string;
//   detectedMime: string;
// }

// /**
//  * ==========================
//  * Allowed File Types
//  * ==========================
//  * Add future file types here safely
//  */
// const allowedMimeTypes = new Set([
//   "image/png",
//   "image/jpeg",
//   "image/jpg",
//   "application/pdf",
//   "text/plain",
// ]);

// /**
//  * ==========================
//  * Validate File
//  * ==========================
//  * - Checks file size
//  * - Detects mime using magic number
//  * - Falls back safely for text files
//  * - Prevents mime spoofing
//  */
// export async function validateFile(
//   file: TempFileObject,
//   maxSize: number
// ): Promise<ValidateResult> {
  
//   // 1️⃣ Size validation
//   if (file.size > maxSize) {
//     throw new Error(`File too large. Max allowed size is ${maxSize} bytes.`);
//   }

//   // 2️⃣ Detect file type using magic number
//   const detected = await fileTypeFromBuffer(file.buffer);

//   let detectedExt: string | undefined;
//   let detectedMime: string | undefined;

//   if (detected) {
//     detectedExt = detected.ext;
//     detectedMime = detected.mime;
//   }

//   // 3️⃣ Special Handling for Text Files
//   // file-type cannot detect plain text
//   if (!detected) {
//     const extFromName = path.extname(file.originalName).toLowerCase();

//     if (extFromName === ".txt") {
//       detectedExt = "txt";
//       detectedMime = "text/plain";
//     } else {
//       throw new Error("Unsupported or unknown file type.");
//     }
//   }

//   // 4️⃣ Final MIME Validation
//   if (!allowedMimeTypes.has(detectedMime!)) {
//     throw new Error(`File type ${detectedMime} is not allowed.`);
//   }

//   return {
//     detectedExt: detectedExt!,
//     detectedMime: detectedMime!,
//   };
// }
