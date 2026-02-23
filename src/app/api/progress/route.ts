import { NextResponse } from 'next/server';
import { getTopicAccuracySummary, getScoreHistory } from '@/lib/db/queries/performance';
import { getTopicWeights } from '@/lib/utils/adaptive-weights';
import { getRecentSessions, getCompletedExamCount } from '@/lib/db/queries/sessions';
import { daysUntilExam, examDateFormatted } from '@/lib/utils/date';
import { computeACTScores } from '@/lib/utils/act-score';
import { TopicBreakdown } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [accuracySummary, weights, scoreHistory, recentSessions, completedExams] = await Promise.all([
    getTopicAccuracySummary(),
    getTopicWeights(),
    getScoreHistory(),
    getRecentSessions(5),
    getCompletedExamCount(),
  ]);

  const days = daysUntilExam();
  const examDate = examDateFormatted();

  // Convert array to useful formats
  const topicAccuracy: Record<string, number> = {};
  const breakdown: TopicBreakdown = {};
  for (const { topic, accuracy, total } of accuracySummary) {
    topicAccuracy[topic] = Math.round(accuracy * 100);
    breakdown[topic] = { correct: Math.round(accuracy * total), total };
  }
  const actScores = computeACTScores(breakdown);

  return NextResponse.json({
    topicAccuracy,
    weights,
    scoreHistory,
    recentSessions,
    completedExams,
    daysUntilExam: days,
    examDate,
    actScores,
  });
}
