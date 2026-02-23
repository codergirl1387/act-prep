'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Question, Section, EXAM_SECTION_ORDER, SECTION_LABELS } from '@/types';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNav } from '@/components/exam/QuestionNav';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { SectionNav } from '@/components/exam/SectionNav';

interface SectionData {
  questions: Question[];
  timeLimitSeconds: number;
}

type ExamSections = Record<Section, SectionData>;

export default function ACTExamPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const [sections, setSections] = useState<ExamSections | null>(null);
  const [currentSection, setCurrentSection] = useState<Section>('english');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, 'A' | 'B' | 'C' | 'D'>>(new Map());
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(`exam-${sessionId}-sections`);
    if (stored) {
      setSections(JSON.parse(stored) as ExamSections);
    }
    setLoading(false);
  }, [sessionId]);

  const currentQuestions = sections?.[currentSection]?.questions ?? [];
  const currentTimeLimitSeconds = sections?.[currentSection]?.timeLimitSeconds ?? 2700;
  const currentQuestion = currentQuestions[currentIndex] ?? null;

  const handleSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQuestion) return;
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, answer));
  };

  const completeSection = () => {
    const sectionOrder = EXAM_SECTION_ORDER;
    const currentSectionIdx = sectionOrder.indexOf(currentSection);

    setCompletedSections((prev) => new Set([...prev, currentSection]));

    if (currentSectionIdx < sectionOrder.length - 1) {
      const nextSection = sectionOrder[currentSectionIdx + 1];
      setCurrentSection(nextSection);
      setCurrentIndex(0);
    }
  };

  const navigateToSection = (section: Section) => {
    setCurrentSection(section);
    setCurrentIndex(0);
  };

  const submitExam = async () => {
    if (!sections || submitting) return;
    setSubmitting(true);

    // Flatten all questions from all sections
    const allQuestions: Question[] = EXAM_SECTION_ORDER.flatMap(
      (s) => sections[s]?.questions ?? []
    );

    const answersPayload = allQuestions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers.get(q.id) ?? null,
    }));

    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: Number(sessionId), answers: answersPayload }),
      });
      const data = await res.json();
      sessionStorage.setItem(`exam-${sessionId}-results`, JSON.stringify({
        ...data,
        questions: allQuestions,
      }));
      router.push(`/exam/${sessionId}/results`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading || !sections) {
    return (
      <div className="text-center py-20 text-gray-400">
        {loading ? 'Loading exam...' : 'No exam data found. Please start a new exam.'}
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center py-20 text-gray-400">No questions found for this section.</div>;
  }

  const sectionAnswerCounts = EXAM_SECTION_ORDER.reduce((acc, s) => {
    const sectionQs = sections[s]?.questions ?? [];
    acc[s] = sectionQs.filter((q) => answers.has(q.id)).length;
    return acc;
  }, {} as Record<Section, number>);

  const answeredInSection = new Set(
    currentQuestions
      .map((q, i) => ({ answered: answers.has(q.id), i }))
      .filter((x) => x.answered)
      .map((x) => x.i)
  );

  const isLastSection = EXAM_SECTION_ORDER.indexOf(currentSection) === EXAM_SECTION_ORDER.length - 1;
  const allSectionsCompleted = EXAM_SECTION_ORDER.every(
    (s) => completedSections.has(s) || s === currentSection
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ACT Exam Simulation</h1>
          <p className="text-sm text-gray-400">
            {SECTION_LABELS[currentSection]} · Question {currentIndex + 1} of {currentQuestions.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExamTimer
            key={currentSection}
            timeLimitSeconds={currentTimeLimitSeconds}
            onTimeUp={completeSection}
          />
          <button
            onClick={submitExam}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>

      <SectionNav
        currentSection={currentSection}
        completedSections={completedSections}
        sectionAnswerCounts={sectionAnswerCounts}
        onNavigate={navigateToSection}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={answers.get(currentQuestion.id) ?? null}
            onSelect={handleSelect}
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30"
            >
              ← Previous
            </button>

            {currentIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Next →
              </button>
            ) : isLastSection ? (
              <button
                onClick={submitExam}
                disabled={submitting}
                className="px-4 py-2 text-sm text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-60"
              >
                Submit Exam →
              </button>
            ) : (
              <button
                onClick={completeSection}
                className="px-4 py-2 text-sm text-green-600 font-semibold hover:text-green-800"
              >
                Complete Section →
              </button>
            )}
          </div>
        </div>

        <div className="w-48 shrink-0">
          <QuestionNav
            total={currentQuestions.length}
            current={currentIndex}
            answered={answeredInSection}
            onNavigate={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}
