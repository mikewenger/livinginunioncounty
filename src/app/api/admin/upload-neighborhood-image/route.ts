import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const slug = formData.get("slug") as string;
    const image = formData.get("image") as File;

    if (!slug || !image) {
      return NextResponse.json({ error: "Missing slug or image" }, { status: 400 });
    }

    const ext = image.name.split(".").pop() ?? "jpg";
    const blob = await put(`neighborhoods/${slug}.${ext}`, image, {
      access: "public",
      contentType: image.type,
    });

    // Update neighborhood-images.json via GitHub API
    const owner = process.env.GITHUB_OWNER ?? "mikewenger";
    const repo = process.env.GITHUB_REPO ?? "livinginunioncounty";
    const token = process.env.GITHUB_TOKEN;
    const filePath = "data/neighborhood-images.json";

    if (token) {
      // Fetch current file
      const getRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        { headers: { Authorization: `Bearer ${token}`, "User-Agent": "livinginunioncounty" } }
      );

      let currentData: Record<string, string> = {};
      let sha: string | undefined;

      if (getRes.ok) {
        const file = await getRes.json();
        sha = file.sha;
        currentData = JSON.parse(Buffer.from(file.content, "base64").toString("utf-8"));
      }

      currentData[slug] = blob.url;

      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "livinginunioncounty",
          },
          body: JSON.stringify({
            message: `Update neighborhood image: ${slug}`,
            content: Buffer.from(JSON.stringify(currentData, null, 2), "utf-8").toString("base64"),
            ...(sha ? { sha } : {}),
          }),
        }
      );
    }

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
