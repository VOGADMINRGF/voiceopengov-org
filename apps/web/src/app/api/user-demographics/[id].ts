import dbConnect from "@/utils/dbConnect";
import UserDemographics from "@/models/UserDemographics";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query; // id = userId (Ref zu UserProfile)

  if (!id) return res.status(400).json({ error: "Missing user ID." });

  try {
    switch (req.method) {
      case "GET":
        // Hole Demographics-Datensatz zu userId
        const demographics = await UserDemographics.findOne({ userId: id });
        if (!demographics) return res.status(404).json({ error: "No demographic data found for this user." });
        return res.status(200).json({ demographics });

      case "PATCH":
        const data = req.body;
        // Optional: Validierung/Consent prüfen!
        const updated = await UserDemographics.findOneAndUpdate(
          { userId: id },
          data,
          { new: true, upsert: true } // Lege an, falls noch nicht existiert!
        );
        return res.status(200).json({ demographics: updated });

      case "DELETE":
        await UserDemographics.deleteOne({ userId: id });
        return res.status(204).end();

      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (err) {
    return res.status(500).json({ error: "Database error.", details: err.message });
  }
}
