// File: api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, message, honeypot } = req.body || {};

    // Honeypot: if bots fill this hidden field, pretend success.
    if (honeypot) return res.status(200).json({ ok: true });

    // Basic validation + simple size limits
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }
    if (name.length > 200 || email.length > 320 || message.length > 5000) {
      return res.status(413).json({ ok: false, error: "Input too long" });
    }

    // Transporter (Zoho SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // e.g. smtp.zoho.eu
      port: Number(process.env.SMTP_PORT),  // e.g. 465
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,        // your Zoho mailbox
        pass: process.env.SMTP_PASS         // Zoho App Password
      }
    });

    // Uncomment while debugging credentials
    // await transporter.verify();

    // 1) Owner notification (reply-to customer)
    await transporter.sendMail({
      from: process.env.MAIL_FROM,                // "Sit & Care <contact@pedrogutierrez.pro>"
      to: process.env.MAIL_TO,                    // main inbox
      cc: process.env.MAIL_CC || undefined,       // optional
      bcc: process.env.MAIL_BCC || undefined,     // optional
      replyTo: email,
      subject: `Neue Anfrage – Sit & Care: ${name}`,
      text:
`Name: ${name}
Email: ${email}

${message}`
    });

    // 2) Auto-reply to customer
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Danke für Ihre Nachricht – Sit & Care",
      text:
`Hallo ${name},

vielen Dank für Ihre Nachricht an Sit & Care. Wir melden uns in Kürze zurück.

Herzliche Grüße
Sit & Care, Walldorf`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({
      ok: false,
      error: String(err?.message || err || "Server error")
    });
  }
}
