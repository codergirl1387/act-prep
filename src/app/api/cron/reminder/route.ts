import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Vercel invokes this at 19:40 UTC (2:40 PM EST) every day via vercel.json cron config
export async function GET() {
  const recipient = process.env.RECIPIENT_EMAIL;
  if (!recipient) {
    return NextResponse.json({ error: 'No RECIPIENT_EMAIL set' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://act-prep.vercel.app';
  const examDate = process.env.EXAM_DATE || 'April 11, 2026';

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: `⏰ Time to study, Netra! Today's flashcards are waiting`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#2563eb">Hey Netra! 📚</h2>
          <p style="font-size:16px;color:#333">
            It's study time! Your daily ACT flashcards and quiz are ready for you.
          </p>
          <p style="color:#555">
            Taking just 15 minutes now to review today's cards will make a big difference
            before your ACT on ${examDate}.
          </p>
          <a href="${baseUrl}/flashcards"
             style="display:inline-block;margin-top:16px;padding:14px 28px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">
            📖 Review Flashcards →
          </a>
          <a href="${baseUrl}/quiz"
             style="display:inline-block;margin-top:8px;margin-left:8px;padding:14px 28px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">
            ✏️ Take Today's Quiz →
          </a>
          <p style="margin-top:24px;color:#999;font-size:12px">
            Sent automatically by ACT Prep at 2:40 PM every day.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Cron/Reminder] Failed:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
