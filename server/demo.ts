import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleDemo } from "./routes/demo.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Call the existing handler function with next function
    await handleDemo(req as any, res as any, () => {});
  } catch (error) {
    console.error("Demo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
