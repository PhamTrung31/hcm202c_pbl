import type { NextApiRequest, NextApiResponse } from "next";
import { listGeminiModels } from "server/routes/list-models";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
  return (listGeminiModels as any)(req as any, res as any);
}
