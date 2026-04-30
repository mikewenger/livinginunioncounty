import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const k1 = process.env.GOOGLE_MAPS_API_KEY;
  const k2 = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return NextResponse.json({
    GOOGLE_MAPS_API_KEY: k1 ? `set (${k1.length} chars, starts: ${k1.slice(0, 6)})` : "NOT SET",
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: k2 ? `set (${k2.length} chars, starts: ${k2.slice(0, 6)})` : "NOT SET",
  });
}
