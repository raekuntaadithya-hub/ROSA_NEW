import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Determine production static path
  const distPublicPath = path.resolve(process.cwd(), "dist", "public");
  const localPublicPath = path.resolve(__dirname, "public");
  const staticPath = fs.existsSync(distPublicPath) ? distPublicPath : localPublicPath;

  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));

    // Handle client-side routing - serve index.html for all non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`ROSA Knee Full-Stack Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
