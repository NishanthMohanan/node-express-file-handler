import { startServer } from "../server";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const maxFileSize =  process.env.MAX_FILE_SIZE ? Number(process.env.MAX_FILE_SIZE) : undefined ;

(async () => {
  try {
    await startServer(port, { uploadDir, maxFileSize });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
