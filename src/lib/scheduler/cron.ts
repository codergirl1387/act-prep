import cron from 'node-cron';

declare global {
  // eslint-disable-next-line no-var
  var __cronInitialized: boolean | undefined;
}

export function initScheduler() {
  if (global.__cronInitialized) return;
  global.__cronInitialized = true;

  // 6:00 AM — generate flashcards and quiz, email them
  cron.schedule('0 6 * * *', async () => {
    console.log('[Cron] Generating daily ACT content...');
    try {
      const { generateDailyFlashcards } = await import('@/lib/ai/flashcard-generator');
      const { generateDailyQuiz } = await import('@/lib/ai/quiz-generator');
      const { sendFlashcardsEmail } = await import('@/lib/email/mailer');
      const { getTodayCards } = await import('@/lib/db/queries/flashcards');
      const { todayString } = await import('@/lib/utils/date');

      await generateDailyFlashcards();
      await generateDailyQuiz();

      const cards = await getTodayCards(todayString());
      const recipient = process.env.RECIPIENT_EMAIL;
      if (recipient && cards.length > 0) {
        await sendFlashcardsEmail(cards, recipient);
        console.log(`[Cron] Flashcards email sent to ${recipient} (${cards.length} cards).`);
      }
    } catch (err) {
      console.error('[Cron] Morning job failed:', err);
    }
  });

  // 2:40 PM — send afternoon reminder
  cron.schedule('40 14 * * *', async () => {
    console.log('[Cron] Sending afternoon study reminder...');
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const recipient = process.env.RECIPIENT_EMAIL;
      if (!recipient) return;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: `Time to study, Netra! Today's ACT cards are waiting`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto">
            <h2 style="color:#2563eb">Hey Netra!</h2>
            <p style="font-size:16px;color:#333">
              It's ACT study time! Your daily flashcards and quiz are ready.
            </p>
            <p style="color:#555">
              April 11th is getting closer — 10 minutes of review now makes a real difference.
            </p>
            <a href="${baseUrl}/flashcards"
               style="display:inline-block;margin-top:16px;padding:14px 28px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">
              Open Flashcards
            </a>
            <a href="${baseUrl}/quiz"
               style="display:inline-block;margin-top:8px;margin-left:8px;padding:14px 28px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px">
              Take Today's Quiz
            </a>
            <p style="margin-top:24px;color:#999;font-size:12px">
              Sent automatically by ACT Prep at 2:40 PM every day.
            </p>
          </div>
        `,
      });

      console.log('[Cron] Study reminder sent to', recipient);
    } catch (err) {
      console.error('[Cron] Reminder email failed:', err);
    }
  });

  console.log('[Cron] ACT scheduler initialized — content at 6:00 AM, reminder at 2:40 PM.');
}
