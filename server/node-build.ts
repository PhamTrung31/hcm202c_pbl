import path from "path";
import { createServer } from "./index";
import express from "express";

const app = createServer();

// Serve static files locally (for dev only)
if (process.env.NODE_ENV !== "production") {
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../spa");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

// 👇 For Vercel Functions: export handler
export default app;
