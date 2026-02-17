import express from "express";
import { createFileRoutes } from "../routes";

export function createApp(options?: { uploadDir?: string; maxFileSize?: number }) {
  const app = express();

  // JSON parser
  app.use(express.json());

  // Routes (factory, configurable)
  app.use("/api/files", createFileRoutes(undefined, options));

  // Static files (for local provider)
  app.use("/uploads", express.static("uploads"));

  // Global Error Middleware - Catches all unhandled errors
  // This middleware must be defined AFTER all routes
  app.use((err: any, req: any, res: any, next: any) => {
    // Log the error for debugging
    console.error("Unhandled Error:", {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
    });

    // Determine HTTP status code
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    // Always return JSON (never HTML error pages)
    res.status(statusCode).json({
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  });

  // 404 Handler - Catch unmapped routes
  app.use((req: any, res: any) => {
    res.status(404).json({
      error: `Route not found: ${req.method} ${req.path}`,
    });
  });

  return app;
}

export default createApp;
