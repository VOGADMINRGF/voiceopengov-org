// apps/web/src/features/media/promo/runPromoPipeline.ts
import { db } from "@/lib/db";
import { buildPromoScript } from "./buildPromoScript";
import { createPromoVideoWithSora } from "./soraVideoProvider";

type Report = {
  id: string;
  title: string;
  summary: string;
  topicTags?: string[];
  language?: "de" | "en";
};

export async function runPromoPipelineForReport(report: Report) {
  // 1) Promo-Datensatz anlegen
  const promo = await db.reportPromo.create({
    data: {
      reportId: report.id,
      script: "",
      status: "RUNNING",
    },
  });

  try {
    // 2) Skript generieren (LLM / Orchestrator)
    const scriptResult = await buildPromoScript({
      id: report.id,
      title: report.title,
      summary: report.summary,
      topicTags: report.topicTags,
      language: report.language,
    });

    // 3) Sora-Clip erzeugen
    const soraVideo = await createPromoVideoWithSora({
      script: scriptResult.script,
      hook: scriptResult.hook,
      cta: scriptResult.cta,
    });

    // 4) Promo als READY speichern
    const updated = await db.reportPromo.update({
      where: { id: promo.id },
      data: {
        script: scriptResult.script,
        audioUrl: null,          // optional: vorerst leer; Audio steckt im Video
        videoUrl: soraVideo.videoUrl,
        status: "READY",
        error: null,
      },
    });

    return updated;
  } catch (err: any) {
    await db.reportPromo.update({
      where: { id: promo.id },
      data: {
        status: "FAILED",
        error: String(err?.message ?? err),
      },
    });
    throw err;
  }
}
