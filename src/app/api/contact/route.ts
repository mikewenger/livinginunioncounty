import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, phone, neighborhood, message, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Living in Union County <noreply@livinginunioncounty.com>",
      to: "mike@mikewenger.us",
      replyTo: email,
      subject: `New inquiry from ${name} — ${type === "homes" ? "Home Search" : type === "neighborhood" ? `Neighborhood: ${neighborhood}` : "General"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td><strong>Phone</strong></td><td>${phone}</td></tr>` : ""}
          <tr><td><strong>Inquiry Type</strong></td><td>${type}</td></tr>
          ${neighborhood ? `<tr><td><strong>Neighborhood</strong></td><td>${neighborhood}</td></tr>` : ""}
          <tr><td><strong>Message</strong></td><td>${message.replace(/\n/g, "<br>")}</td></tr>
        </table>
        <hr>
        <p style="color:#666;font-size:12px">Sent from livinginunioncounty.com contact form</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
