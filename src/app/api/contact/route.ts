import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, email, message } = body;

    // Basic server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are all required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // ── Nodemailer transporter (Gmail with App Password) ──────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,       // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD, // 16-char Google App Password
      },
    });

    // ── Email to the hostel team ──────────────────────────────────────────
    await transporter.sendMail({
      from: `"Xtracity Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER,        // Who receives the inquiry
      replyTo: email,                        // Replying goes directly to the visitor
      subject: `New Inquiry from ${name} – Xtracity Hostels`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #E03B0D; margin-top: 0;">New Contact Inquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
              <td style="padding: 8px 0; color: #111827;"><a href="mailto:${email}" style="color: #E03B0D;">${email}</a></td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="font-weight: bold; color: #374151; margin-bottom: 8px;">Message:</p>
          <p style="color: #111827; line-height: 1.6; white-space: pre-wrap; background: #f9fafb; padding: 16px; border-radius: 8px;">${message}</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 24px;">
            Sent via the Xtracity Hostels contact form on ${new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' })}
          </p>
        </div>
      `,
    });

    // ── Auto-reply to the visitor ─────────────────────────────────────────
    await transporter.sendMail({
      from: `"Xtracity Hostels" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your message – Xtracity Hostels',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #E03B0D; margin-top: 0;">Thank you, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6;">
            We've received your message and a member of our team will get back to you within <strong>4 hours</strong> during business hours (Mon–Fri, 8:00 AM – 5:00 PM).
          </p>
          <p style="color: #374151; line-height: 1.6;">
            For urgent matters, you can reach us directly:<br/>
            📞 Front Desk: <strong>+233 (0) 50 123 4567</strong><br/>
            📧 Email: <strong>xtracityhostels@gmail.com</strong>
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            Xtracity Hostels & Apartments · Cosway St, Agbogba, Accra, Ghana
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[/api/contact] Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
