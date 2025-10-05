// File: api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, message, honeypot } = req.body || {};
    if (honeypot) return res.status(200).json({ ok: true });
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // e.g. smtp.zoho.eu
      port: Number(process.env.SMTP_PORT),  // e.g. 465
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    // Optional: uncomment to verify SMTP credentials on each call during testing
    // await transporter.verify();

    // 1) Owner notification (add replyTo + optional CC/BCC)
    await transporter.sendMail({
      from: process.env.MAIL_FROM,  // MUST match your Zoho mailbox
      to: process.env.MAIL_TO,
      cc: process.env.MAIL_CC || undefined,    // optional env var
      bcc: process.env.MAIL_BCC || undefined,  // optional env var
      replyTo: email, // reply goes to the customer
      subject: `Neue Anfrage – Sit & Care: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    // 2) Auto-reply to the customer
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Danke für Ihre Nachricht – Sit & Care",
      text: `Hallo ${name},

vielen Dank für Ihre Nachricht an Sit & Care. Wir melden uns in Kürze zurück.

Herzliche Grüße
Sit & Care, Walldorf`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    // Surface the real error during setup; swap back to generic once stable
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}
