export default function handler(req, res) {
    res.status(200).json({ status: "online", latency: 220, details: { tokensToday: 2000 } });
  }
  