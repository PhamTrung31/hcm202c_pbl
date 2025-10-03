import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();

// Ensure we bind to the PORT provided by the environment (Render requires this)
const port = Number(process.env.PORT ?? 3000);

// In production, serve the built SPA files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common build outputs:
// - client dist at dist/ (default Vite output)
// - some setups place SPA under dist/spa
// Try to find the built index.html in common locations
const candidates = [
  path.join(__dirname, "../spa/index.html"),
  path.join(__dirname, "../dist/index.html"),
  path.join(__dirname, "../index.html"),
  path.join(__dirname, "../../dist/index.html"),
];

let indexFile: string | null = null;
for (const c of candidates) {
  if (fs.existsSync(c)) {
    indexFile = c;
    break;
  }
}

if (!indexFile) {
  console.warn(`⚠️ No built SPA index.html found. Tried: ${candidates.join(', ')}. Static file serving disabled.`);
} else {
  const staticDir = path.dirname(indexFile);
  console.log(`ℹ️ Serving static files from ${staticDir}`);
  app.use(express.static(staticDir));

  // Serve index.html for non-API routes (avoid path-to-regexp patterns)
  app.use((req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(indexFile as string);
  });
}

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
