import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("name") ?? "";
  const city = searchParams.get("city") ?? "Union County";
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const location = encodeURIComponent(`${name}, ${city}, NC`);
  const url = `https://maps.googleapis.com/maps/api/streetview?size=1200x400&location=${location}&fov=90&pitch=0&key=${apiKey}`;

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
