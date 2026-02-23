import nodemailer from 'nodemailer';
import { StudyCard, Section, SECTION_LABELS } from '@/types';

function createTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendFlashcardsEmail(cards: StudyCard[], recipientEmail: string): Promise<void> {
  const transporter = createTransport();

  const cardRows = cards
    .map(
      (card, i) => `
    <tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'}">
      <td style="padding:10px;border:1px solid #ddd;font-weight:bold;color:#333">${SECTION_LABELS[card.topic as Section]}</td>
      <td style="padding:10px;border:1px solid #ddd">${card.front}</td>
      <td style="padding:10px;border:1px solid #ddd;color:#555">${card.back}</td>
    </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto">
      <h2 style="color:#2563eb">Today's ACT Study Cards</h2>
      <p>Review these ${cards.length} cards for today. Tap the app to flip and rate them!</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">
        <thead>
          <tr style="background:#2563eb;color:#fff">
            <th style="padding:10px;text-align:left">Section</th>
            <th style="padding:10px;text-align:left">Concept</th>
            <th style="padding:10px;text-align:left">Explanation</th>
          </tr>
        </thead>
        <tbody>${cardRows}</tbody>
      </table>
      <p style="margin-top:20px;color:#666;font-size:12px">ACT Prep App — April 11, 2026</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `ACT Daily Cards — ${new Date().toLocaleDateString('en-CA')}`,
    html,
  });
}

export async function sendQuizEmail(
  quizLink: string,
  questionCount: number,
  recipientEmail: string
): Promise<void> {
  const transporter = createTransport();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#7c3aed">Today's ACT Pop Quiz</h2>
      <p>Your daily ${questionCount}-question ACT quiz is ready!</p>
      <p>You have <strong>20 minutes</strong> to complete it across all 4 sections.</p>
      <a href="${quizLink}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
        Start Quiz
      </a>
      <p style="margin-top:20px;color:#666;font-size:12px">ACT Prep App — April 11, 2026</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: `ACT Daily Quiz — ${new Date().toLocaleDateString('en-CA')}`,
    html,
  });
}
