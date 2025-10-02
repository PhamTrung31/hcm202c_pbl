import type { NextApiRequest, NextApiResponse } from "next";
import { getQuizStats } from "server/routes/quiz-questions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
  return (getQuizStats as any)(req as any, res as any);
}
