// File: api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, email, message, honeypot } = req.body || {};

    // Simple bot honeypot
    if (honeypot) return res.status(200).json({ ok: true });

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing fields" });
    }

    // Create transporter (Zoho SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // e.g. smtp.zoho.eu
      port: Number(process.env.SMTP_PORT),  // e.g. 465
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,        // e.g. contact@pedrogutierrez.pro
        pass: process.env.SMTP_PASS         // Zoho app password
      }
    });

    // Optional: uncomment to verify connection during testing
    // await transporter.verify();

    // 1) Send owner notification
    await transporter.sendMail({
      from: process.env.MAIL_FROM,   // "Sit & Care <contact@pedrogutierrez.pro>"
      to: process.env.MAIL_TO,       // Main inbox for inquiries
      cc: process.env.MAIL_CC || undefined,   // Optional CC
      bcc: process.env.MAIL_BCC || undefined, // Optional BCC
      replyTo: email,                // When you hit reply, it goes to the customer
      subject: `Neue Anfrage – Sit & Care: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    // 2) Send auto-reply to customer
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: "Danke für Ihre Nachricht – Sit & Care",
      text: `Hallo ${name},

vielen Dank für Ihre Nachricht an Sit & Care. Wir melde
