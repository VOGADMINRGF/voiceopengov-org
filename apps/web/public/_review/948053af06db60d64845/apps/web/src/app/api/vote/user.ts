// api/votes/user.ts (Next.js API Route)

import dbConnect from "@/utils/dbConnect";
import Vote from "@/models/Vote";

export default async function handler(req, res) {
  await dbConnect();

  const { statementId, userHash } = req.query;
  if (!statementId || !userHash) {
    return res.status(400).json({ error: "Missing parameters." });
  }

  try {
    const vote = await Vote.findOne({ statementId, userHash });
    return res.status(200).json({ vote: vote ? vote.vote : null });
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
}
