import { OpenAI } from "openai"; // npm install openai

export async function generateVOGImage({
  prompt,
  fallbackText = "VoiceOpenGov",
  aspectRatio = "16:9",
  ciColors = ["#FF6F61", "#00B3A6", "#4B0082"]
}: {
  prompt: string;
  fallbackText?: string;
  aspectRatio?: string;
  ciColors?: string[];
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY; // Holt sich den Key aus .env.local

  if (!apiKey) {
    console.warn("[generateVOGImage] Kein OpenAI-API-Key in .env.local gefunden!");
    return "/dummy/vog-default.jpg";
  }

  const colorStr = ciColors.join(", ");
  const safePrompt = `
    ${prompt.trim()}
    Stil: moderne Illustration, hohe Farbigkeit, klar, jugendlich, Farbschema: ${colorStr}.
    Füge subtil den Schriftzug '${fallbackText}' als Wasserzeichen unten rechts ein.
    Keine fremden Logos, kein Text außer dem Wasserzeichen.
    Format: ${aspectRatio}, ideal für Social/Feed.
    Hintergrund neutral, keine realen Personen, keine Markennamen.
  `.replace(/\s+/g, " ");

  let imageUrl = "";
  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.images.generate({
      prompt: safePrompt,
      n: 1,
      size: "1024x576" // 16:9
    });
    imageUrl = response.data[0]?.url || "";
  } catch (err) {
    console.error("[generateVOGImage] Fehler:", err);
    imageUrl = "/dummy/vog-default.jpg"; // Fallback
  }
  return imageUrl;
}
