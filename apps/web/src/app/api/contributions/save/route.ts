export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Contribution from "@/models/Contribution";

type ContributionPayload = {
  title?: string;
  summary?: string;
  content?: string;
  language?: string;
  userContext?: any;
  topics?: any;
  level?: any;
  context?: any;
  suggestions?: any;
  statements?: any;
  alternatives?: any;
  facts?: any;
  media?: any;
  links?: any;
  analysis?: any;
  authorId?: string | null;
};

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "POST required" }, { status: 405 });
  }

  let body: ContributionPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  await dbConnect();

  const {
    title,
    summary,
    content,
    language,
    userContext,
    topics,
    level,
    context,
    suggestions,
    statements,
    alternatives,
    facts,
    media,
    links,
    analysis,
    authorId,
  } = body;

  if (!content) {
    return NextResponse.json({ error: "Kein Inhalt." }, { status: 400 });
  }

  const provenance = [
    {
      action: "created",
      by: authorId || "anonymous",
      date: new Date(),
      details: "Initial contribution",
    },
  ];

  const doc = new Contribution({
    title,
    summary,
    content,
    language,
    userContext,
    topics,
    level,
    context,
    suggestions,
    statements,
    alternatives,
    facts,
    media,
    links,
    analysis,
    provenance,
    authorId,
    createdAt: new Date(),
  });

  await doc.save();

  return NextResponse.json(doc, { status: 201 });
}
