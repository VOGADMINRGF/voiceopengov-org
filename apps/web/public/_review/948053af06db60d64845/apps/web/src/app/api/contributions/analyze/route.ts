// apps/web/src/app/api/contributions/analyze/route.ts
import { askGPT, askARI } from "@features/contribution/utils/analyze"; // Siehe unten
import { analyzeContributionE120 } from "@/utils/aiProviders";
import formidable from "formidable-serverless"; // Zum Parsen von Uploads
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // für file upload!
  },
};
export async function POST(req: Request) {
  try {
    const { text, userContext } = await req.json();
    // ... (ggf. mehr Inputs)
    const result = await analyzeContributionE120({ text }, userContext);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // Fehlerlogging etc.
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST required" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Fehler beim Upload" });

    // Input vorbereiten
    const { text, userContext, links } = fields;
    // Optional: File Handling (hier nur Pfade, in produktiv auf S3/etc. hochladen!)
    const media = [];
    for (const key in files) {
      const file = files[key];
      const filePath = "/uploads/" + file.name; // Beispiel-Pfad
      fs.copyFileSync(file.path, "public" + filePath); // Lokal speichern
      media.push({
        type: file.type?.split("/")[0] || "other",
        url: filePath,
        filename: file.name,
        size: file.size,
        mimeType: file.type
      });
    }

    // 1. GPT-KI-Analyse
    const gptResult = await askGPT({
      text,
      userContext,
      links,
      media
    });

    // 2. ARI-KI-Analyse (Orchestrator, Recherchen etc.)
    const ariResult = await askARI({
      text,
      userContext,
      links,
      media,
      gptData: gptResult
    });

    // Kombiniere Ergebnisse, reduziere auf max. 10 Statements, alles transparent zurück
    const statements = (gptResult?.statements || []).slice(0, 10);

    res.status(200).json({
      ...gptResult,
      ...ariResult,
      statements,
      media
    });
  });
}
