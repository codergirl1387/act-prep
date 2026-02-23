import { SectionHeatmap } from '@/components/progress/SectionHeatmap';
import { PerformanceLine } from '@/components/progress/PerformanceLine';
import { ACTScoreGauge } from '@/components/progress/ACTScoreGauge';
import { getTopicAccuracySummary, getScoreHistory } from '@/lib/db/queries/performance';
import { getTopicWeights } from '@/lib/utils/adaptive-weights';
import { getCompletedExamCount } from '@/lib/db/queries/sessions';
import { daysUntilExam, examDateFormatted } from '@/lib/utils/date';
import { SECTION_LABELS, Section, TopicBreakdown } from '@/types';
import { computeACTScores } from '@/lib/utils/act-score';
import { MAX_EXAM_SLOTS } from '@/lib/utils/sections';

export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const [accuracySummary, weights, scoreHistory, completedExams] = await Promise.all([
    getTopicAccuracySummary(),
    getTopicWeights(),
    getScoreHistory(),
    getCompletedExamCount(),
  ]);
  const days = daysUntilExam();

  // Convert array to Record<section, accuracy%> for SectionHeatmap
  const accuracyMap: Record<string, number> = {};
  const breakdown: TopicBreakdown = {};
  for (const { topic, accuracy, total } of accuracySummary) {
    accuracyMap[topic] = Math.round(accuracy * 100);
    breakdown[topic] = { correct: Math.round(accuracy * total), total };
  }

  const actScores = computeACTScores(breakdown);
  const hasData = accuracySummary.length > 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-gray-500 text-sm mt-1">
          {days} day{days === 1 ? '' : 's'} until ACT ({examDateFormatted()}) · {completedExams} / {MAX_EXAM_SLOTS} exams completed
        </p>
      </div>

      {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <SectionHeatmap breakdown={accuracyMap} />
          <ACTScoreGauge scores={actScores} />
        </div>
      )}

      <section className="mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Score History</h2>
        <PerformanceLine data={scoreHistory} />
      </section>

      <section>
        <h2 className="font-semibold text-gray-800 mb-4">Study Focus (Adaptive Weights)</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-3">
            These weights determine how much today&apos;s quizzes and flashcards focus on each section.
            Weak sections (lower accuracy) get higher weight.
          </p>
          <div className="space-y-2">
            {weights
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((w) => (
                <div key={w.topic} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-24 shrink-0">
                    {SECTION_LABELS[w.topic as Section] ?? w.topic}
                  </span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.round(w.weight * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {Math.round(w.weight * 100)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
