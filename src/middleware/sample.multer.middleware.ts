// import multer, { MulterError } from "multer";
// import { v4 as uuidv4 } from "uuid";
// import { FileObject } from "../types";
// import { validateFile, ValidationError } from "../utils/validators";

// export function createUploadHandlers(maxFileSize = 1 * 1024 * 1024) {
//   const storage = multer.memoryStorage();

//   const limits = {
//     fileSize: maxFileSize,
//   };

//   // Create raw multer middleware
//   const rawUploadMiddleware = multer({ storage, limits }).single("file");
//   const rawMultiUploadMiddleware = multer({ storage, limits }).array("files");

//   // Wrap single upload middleware with error handler
//   const uploadMiddleware = (req: any, res: any, next: any) => {
//     rawUploadMiddleware(req, res, (err: any) => {
//       // Handle multer-specific errors
//       if (err instanceof MulterError) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
//           return res.status(413).json({
//             error: `File too large: maximum file size is ${maxSizeMB}MB`,
//             code: "LIMIT_FILE_SIZE",
//           });
//         }
//         if (err.code === "LIMIT_FILES") {
//           return res.status(400).json({
//             error: "Too many files uploaded",
//             code: "LIMIT_FILES",
//           });
//         }
//         // Generic multer error
//         return res.status(400).json({
//           error: `Upload error: ${err.message}`,
//           code: err.code,
//         });
//       }

//       // Any other unexpected error
//       if (err) {
//         return res.status(400).json({
//           error: `Upload failed: ${err.message}`,
//         });
//       }

//       // No error, proceed to next middleware
//       next();
//     });
//   };

//   // Wrap multi-upload middleware with error handler
//   const multiUploadMiddleware = (req: any, res: any, next: any) => {
//     rawMultiUploadMiddleware(req, res, (err: any) => {
//       // Handle multer-specific errors
//       if (err instanceof MulterError) {
//         if (err.code === "LIMIT_FILE_SIZE") {
//           const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2);
//           return res.status(413).json({
//             error: `File too large: maximum file size is ${maxSizeMB}MB`,
//             code: "LIMIT_FILE_SIZE",
//           });
//         }
//         if (err.code === "LIMIT_FILES") {
//           return res.status(400).json({
//             error: "Too many files uploaded",
//             code: "LIMIT_FILES",
//           });
//         }
//         // Generic multer error
//         return res.status(400).json({
//           error: `Upload error: ${err.message}`,
//           code: err.code,
//         });
//       }

//       // Any other unexpected error
//       if (err) {
//         return res.status(400).json({
//           error: `Upload failed: ${err.message}`,
//         });
//       }

//       // No error, proceed to next middleware
//       next();
//     });
//   };

//   function toFileObject(req: any): FileObject | null {
//     // Check if file was received by multer
//     if (!req.file) {
//       return null; // Return null, let controller handle the error
//     }

//     const file: FileObject = {
//       id: uuidv4(),
//       originalName: req.file.originalname,
//       mimeType: req.file.mimetype,
//       size: req.file.size,
//       buffer: req.file.buffer,
//       folder: req.body.uploadDir,
//     };

//     // Validate the file (will throw ValidationError if invalid)
//     validateFile(file, maxFileSize);

//     return file;
//   }

//   function toFileObjects(req: any): FileObject[] {
//     if (!req.files || !Array.isArray(req.files)) {
//       return []; // Return empty array, let controller handle the error
//     }

//     return req.files.map((f: any) => {
//       const file: FileObject = {
//         id: uuidv4(),
//         originalName: f.originalname,
//         mimeType: f.mimetype,
//         size: f.size,
//         buffer: f.buffer,
//         folder: req.body.uploadDir,
//       };

//       // Validate each file (will throw ValidationError if invalid)
//       validateFile(file, maxFileSize);

//       return file;
//     });
//   }

//   return {
//     uploadMiddleware,
//     multiUploadMiddleware,
//     toFileObject,
//     toFileObjects,
//   };
// }

// export default createUploadHandlers;
