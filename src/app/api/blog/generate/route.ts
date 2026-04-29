import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

function checkAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

async function generate() {
  const today = new Date().toISOString().split("T")[0];
  const filePath = `content/blog/${today}.md`;

  const owner = process.env.GITHUB_OWNER ?? "mikewenger";
  const repo = process.env.GITHUB_REPO ?? "livinginunioncounty";
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN env var not set");
  }

  // Check if post already exists
  const checkRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    { headers: { Authorization: `Bearer ${token}`, "User-Agent": "livinginunioncounty" } }
  );
  if (checkRes.ok) {
    return { message: "Already generated today", slug: today };
  }

  // Pick topic by day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const topic = TOPICS[dayOfYear % TOPICS.length];

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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

  const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${today}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
author: "Mike Wenger"
---

${body}`;

  // Commit to GitHub
  const commitRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "livinginunioncounty",
      },
      body: JSON.stringify({
        message: `Blog: ${title}`,
        content: Buffer.from(fileContent, "utf-8").toString("base64"),
      }),
    }
  );

  if (!commitRes.ok) {
    const err = await commitRes.text();
    throw new Error(`GitHub commit failed: ${err}`);
  }

  return { ok: true, slug: today, title };
}

// Vercel crons send GET requests
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await generate();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Blog generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

// Keep POST for manual triggering
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await generate();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Blog generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
