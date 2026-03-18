import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, getSessionAnswers } from '@/lib/db/queries/sessions';
import { getQuestionsForSession } from '@/lib/db/queries/questions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionId = Number(req.nextUrl.searchParams.get('sessionId'));
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  const session = await getSessionById(sessionId);
  if (!session || !session.completedAt) {
    return NextResponse.json({ error: 'Session not found or not completed' }, { status: 404 });
  }

  const [answers, questions] = await Promise.all([
    getSessionAnswers(sessionId),
    getQuestionsForSession(sessionId),
  ]);

  const results = answers.map((a) => ({
    questionId: a.questionId,
    isCorrect: a.isCorrect,
    correctAnswer: questions.find((q) => q.id === a.questionId)?.correctAnswer ?? '',
  }));

  const correct = results.filter((r) => r.isCorrect).length;
  const total = results.length;

  return NextResponse.json({
    score: session.score ?? 0,
    correct,
    total,
    topicBreakdown: session.topicBreakdown ? JSON.parse(session.topicBreakdown) : {},
    results,
    questions,
  });
}
