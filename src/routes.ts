import { Router } from "express";
import path from "path";
import createUploadHandlers from "./middleware/multer.middleware";
import { FileHandler } from "./file-handler";
import { ValidationError } from "./utils/validators";

export function createFileRoutes(handler?: FileHandler, options?: { uploadDir?: string; maxFileSize?: number }) {
  const router = Router();

  const effectiveHandler = handler || new FileHandler(options?.uploadDir || path.join(process.cwd(), "uploads"));

  const { uploadMiddleware, multiUploadMiddleware, toFileObject, toFileObjects } = createUploadHandlers(options?.maxFileSize);

  // SINGLE UPLOAD
  router.post("/upload", uploadMiddleware, async (req, res, next) => {
    try {
      // Manual check: no file received
      console.log("req.file:", req.file);
      console.log("req.body:", req.body);
      const file = toFileObject(req);
      // if (!file) {
      //   return res.status(400).json({
      //     error: "No file uploaded: please provide a file",
      //   });
      // }

      const uploadDir = req.body.uploadDir;
      const result = await effectiveHandler.upload(file, uploadDir, options?.maxFileSize);

      res.json({
        message: result.duplicate ? "Duplicate file" : "File uploaded",
        file: result,
      });
    } catch (err: any) {
      // Handle ValidationError from validators
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
          error: err.message,
        });
      }

      // Handle other known errors
      if (err.message && err.message.includes("File")) {
        return res.status(400).json({ error: err.message });
      }

      // Pass unexpected errors to global error handler
      next(err);
    }
  });

  // MULTIPLE UPLOAD
  router.post("/upload-multiple", multiUploadMiddleware, async (req, res, next) => {
    try {
      const uploadDir = req.body.uploadDir;
      const files = toFileObjects(req);

      // Manual check: no files received
      if (!files.length) {
        return res.status(400).json({
          error: "No files uploaded: please provide file",
        });
      }

      const results = await Promise.all(
        files.map((f) => effectiveHandler.upload(f, uploadDir, options?.maxFileSize))
      );

      res.json({
        message: "Files processed",
        files: results,
      });
    } catch (err: any) {
      // Handle ValidationError from validators
      if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
          error: err.message,
        });
      }

      // Handle other known errors
      if (err.message && err.message.includes("File")) {
        return res.status(400).json({ error: err.message });
      }

      // Pass unexpected errors to global error handler
      next(err);
    }
  });

  // DELETE BY ID
  router.delete("/delete/:id", async (req, res, next) => {
    try {
      await effectiveHandler.delete(req.params.id);
      res.json({ message: "File deleted" });
    } catch (err: any) {
      // Handle file not found
      if (err.message && err.message.includes("not found")) {
        return res.status(404).json({ error: err.message });
      }

      // Handle other errors
      if (err.message) {
        return res.status(400).json({ error: err.message });
      }

      // Pass unexpected errors to global error handler
      next(err);
    }
  });

  return router;
}

export default createFileRoutes;
