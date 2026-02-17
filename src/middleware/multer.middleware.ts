import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { FileObject } from "../types";
import { validateFile, ValidationError } from "../utils/validators";
import { DEFAULT_MAX_FILE_SIZE } from "../file-handler";

export function createUploadHandlers(maxFileSize?: number) {
  const effectiveMaxSize = maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const storage = multer.memoryStorage();

  const limits = {
    fileSize: effectiveMaxSize,
  };

  const multerInstance = multer({ storage, limits });

  const uploadMiddleware = (req: any, res: any, next: any) => {
    multerInstance.single("file")(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(
            new ValidationError(
              err.code === "LIMIT_FILE_SIZE" ? 413 : 400,
              err.code === "LIMIT_FILE_SIZE" ? "File too large" : err.message,
            ),
          );
        }
        return next(new ValidationError(400, err.message));
      }
      next();
    });
  };
  const multiUploadMiddleware = (req: any, res: any, next: any) => {
    multerInstance.array("files")(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(
            new ValidationError(
              err.code === "LIMIT_FILE_SIZE" ? 413 : 400,
              err.code === "LIMIT_FILE_SIZE" ? "File too large" : err.message,
            ),
          );
        }
        return next(new ValidationError(400, err.message));
      }
      next();
    });
  };

  function toFileObject(req: any): FileObject {
    if (!req.file) {
      throw new Error("No file received");
    }

    const file: FileObject = {
      id: uuidv4(),
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
      folder: req.body.uploadDir,
    };
    // Validate the file
    validateFile(file, maxFileSize);
    console.log("Validating file:", file.originalName);
    return file;
  }

  function toFileObjects(req: any): FileObject[] {
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error("No files received");
    }

    return req.files.map((f: any) => {
      const file: FileObject = {
        id: uuidv4(),
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
        buffer: f.buffer,
        folder: req.body.uploadDir,
      };

      // Validate each file in multifiles
      // validateFile(file, maxFileSize);
      // console.log("Validating file:", file.originalName);
      return file;
    });
  }

  return {
    uploadMiddleware,
    multiUploadMiddleware,
    toFileObject,
    toFileObjects,
  };
}

export default createUploadHandlers;
