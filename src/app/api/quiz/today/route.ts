import { NextResponse } from 'next/server';
import { generateDailyQuiz } from '@/lib/ai/quiz-generator';
import { getTodayQuizSession } from '@/lib/db/queries/sessions';
import { getQuestionsForSession } from '@/lib/db/queries/questions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const existing = await getTodayQuizSession();
    if (existing && existing.completedAt) {
      return NextResponse.json({
        sessionId: existing.id,
        completed: true,
        score: existing.score,
        questions: [],
      });
    }

    if (existing) {
      // Incomplete session from earlier today — reload its questions
      const questions = await getQuestionsForSession(existing.id);
      if (questions.length > 0) {
        return NextResponse.json({ sessionId: existing.id, questions, completed: false });
      }
      // No linked questions (legacy session before this fix) — fall through to generate
    }

    const { sessionId, questions } = await generateDailyQuiz();
    return NextResponse.json({ sessionId, questions, completed: false });
  } catch (err) {
    console.error('[Quiz] Error generating daily quiz:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
