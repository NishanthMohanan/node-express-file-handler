import { createApp } from "./app";
export * from "../file-handler";
export * from "../middleware/multer.middleware";
export * from "../types";

export function startServer(port = 4000, options?: { uploadDir?: string; maxFileSize?: number }) {
  const app = createApp(options);
  return new Promise<void>((resolve) => {
    app.listen(port, () => {
      // NOTE: keep console output for manual runs
      // eslint-disable-next-line no-console
      console.log(`FileHandler API running on http://localhost:${port}`);
      resolve();
    });
  });
}

export { createApp };
