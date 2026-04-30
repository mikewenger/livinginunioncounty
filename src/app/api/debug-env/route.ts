import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const k1 = process.env.GOOGLE_MAPS_API_KEY;
  const k2 = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const k3 = process.env.RESEND_API_KEY;
  const k4 = process.env.ANTHROPIC_API_KEY;
  const k5 = process.env.CRON_SECRET;
  const k6 = process.env.GITHUB_TOKEN;
  return NextResponse.json({
    GOOGLE_MAPS_API_KEY: k1 ? `set (${k1.length} chars, starts: ${k1.slice(0, 6)})` : "NOT SET",
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: k2 ? `set (${k2.length} chars, starts: ${k2.slice(0, 6)})` : "NOT SET",
    RESEND_API_KEY: k3 ? `set (${k3.length} chars)` : "NOT SET",
    ANTHROPIC_API_KEY: k4 ? `set (${k4.length} chars)` : "NOT SET",
    CRON_SECRET: k5 ? "set" : "NOT SET",
    GITHUB_TOKEN: k6 ? "set" : "NOT SET",
  });
}
