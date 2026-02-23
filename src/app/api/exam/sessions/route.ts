import { NextResponse } from 'next/server';
import { createSession, getRecentSessions, getCompletedExamCount } from '@/lib/db/queries/sessions';
import { generateFullExam } from '@/lib/ai/exam-generator';
import { MAX_EXAM_SLOTS } from '@/lib/utils/sections';
import { FULL_EXAM_TIME_SECONDS } from '@/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET() {
  const sessions = await getRecentSessions(20);
  return NextResponse.json({ sessions });
}

export async function POST() {
  try {
    const completedCount = await getCompletedExamCount();
    if (completedCount >= MAX_EXAM_SLOTS) {
      return NextResponse.json(
        { error: `You've used all ${MAX_EXAM_SLOTS} full exam slots. Focus on quizzes and flashcards now!` },
        { status: 400 }
      );
    }

    console.log(`[Exam] Generating full exam (slot ${completedCount + 1} of ${MAX_EXAM_SLOTS})...`);
    const sections = await generateFullExam();

    const totalQuestions =
      sections.english.questions.length +
      sections.math.questions.length +
      sections.reading.questions.length +
      sections.science.questions.length;

    const sessionId = await createSession('exam', FULL_EXAM_TIME_SECONDS);
    console.log(`[Exam] Session ${sessionId} created with ${totalQuestions} questions.`);

    return NextResponse.json({ sessionId, sections });
  } catch (err) {
    console.error('[Exam] Failed to create session:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
