import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, brokerage, license, website, photo, neighborhood, bio, services } = body;

    if (!name || !email || !phone || !brokerage || !license || !neighborhood || !bio) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Living in Union County <noreply@livinginunioncounty.com>",
      to: "mike@mikewenger.us",
      replyTo: email,
      subject: `Neighborhood Expert Application — ${name} for ${neighborhood}`,
      html: `
        <h2>New Neighborhood Expert Application</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Brokerage</strong></td><td>${brokerage}</td></tr>
          <tr><td><strong>License #</strong></td><td>${license}</td></tr>
          <tr><td><strong>Neighborhood</strong></td><td>${neighborhood}</td></tr>
          ${website ? `<tr><td><strong>Website</strong></td><td><a href="${website}">${website}</a></td></tr>` : ""}
          ${photo ? `<tr><td><strong>Headshot URL</strong></td><td><a href="${photo}">${photo}</a></td></tr>` : ""}
          <tr><td><strong>Services</strong></td><td>${Array.isArray(services) ? services.join(", ") : "—"}</td></tr>
          <tr><td><strong>Bio / Why Expert</strong></td><td>${bio.replace(/\n/g, "<br>")}</td></tr>
        </table>
        <hr>
        <p style="color:#666;font-size:12px">
          To approve: add this agent to <code>data/neighborhood-experts.json</code> under the neighborhood slug, then commit and push.
        </p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Expert apply error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
