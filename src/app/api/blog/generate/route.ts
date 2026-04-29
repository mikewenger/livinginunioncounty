import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const TOPICS = [
  "the best parks and greenways in Union County, NC",
  "what makes Waxhaw, NC a great place to live",
  "Union County public school rankings and what parents should know",
  "the top neighborhoods in Indian Trail, NC for families",
  "moving to Monroe, NC — what to expect",
  "Marvin, NC — an upscale community in Union County",
  "the real estate market in Union County, NC this year",
  "things to do with kids in Union County, NC",
  "the best restaurants in Waxhaw, NC",
  "why families are choosing Union County over Mecklenburg County",
  "Wesley Chapel, NC — one of Union County's fastest growing areas",
  "Sun Valley High School and its surrounding neighborhoods",
  "Weddington, NC — top-rated schools and luxury homes",
  "commuting from Union County to Charlotte — what to know",
  "new construction neighborhoods in Union County, NC",
  "Cuthbertson schools and the neighborhoods they serve",
  "Porter Ridge High School area neighborhoods",
  "cost of living comparison: Union County vs Charlotte",
  "Union County farmers markets and local food scene",
  "HOA communities in Union County — what buyers should know",
];

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const today = new Date().toISOString().split("T")[0];
    const blogDir = path.join(process.cwd(), "content", "blog");
    fs.mkdirSync(blogDir, { recursive: true });

    const outPath = path.join(blogDir, `${today}.md`);
    if (fs.existsSync(outPath)) {
      return NextResponse.json({ message: "Already generated today" });
    }

    // Pick a topic — rotate through by day of year
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const topic = TOPICS[dayOfYear % TOPICS.length];

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Write an informative, friendly blog post about: "${topic}"

The post is for people who are considering moving to Union County, NC (near Charlotte).
Author is Mike Wenger, a local real estate professional.

Format the post in Markdown with:
- A compelling title (no # prefix, just the title text on the first line)
- An excerpt/summary (second line, one sentence)
- Then the full article body with ## subheadings, short paragraphs, and helpful specifics

Keep it ~500 words. Tone: helpful, knowledgeable local expert. No hype.
Start directly with the title.`,
        },
      ],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";
    const lines = raw.trim().split("\n");
    const title = lines[0].replace(/^#+\s*/, "").trim();
    const excerpt = lines[1]?.trim() ?? "";
    const body = lines.slice(2).join("\n").trim();

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${today}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
author: "Mike Wenger"
---

`;

    fs.writeFileSync(outPath, frontmatter + body, "utf-8");

    return NextResponse.json({ ok: true, slug: today, title });
  } catch (err) {
    console.error("Blog generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
