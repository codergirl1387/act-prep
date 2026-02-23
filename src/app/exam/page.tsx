'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SECTION_QUESTION_COUNTS, SECTION_TIME_LIMITS, EXAM_SECTION_ORDER, SECTION_LABELS } from '@/types';
import { MAX_EXAM_SLOTS } from '@/lib/utils/sections';

export default function ExamSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedExams, setCompletedExams] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/exam/sessions')
      .then((r) => r.json())
      .then((data) => {
        const completed = (data.sessions ?? []).filter(
          (s: { completedAt: string | null }) => s.completedAt !== null
        ).length;
        setCompletedExams(completed);
      })
      .catch(() => setCompletedExams(0));
  }, []);

  const startExam = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/exam/sessions', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');

      sessionStorage.setItem(`exam-${data.sessionId}-sections`, JSON.stringify(data.sections));
      router.push(`/exam/${data.sessionId}`);
    } catch (err) {
      setError(String(err));
      setLoading(false);
    }
  };

  const slotsLeft = completedExams !== null ? MAX_EXAM_SLOTS - completedExams : null;
  const noSlotsLeft = slotsLeft !== null && slotsLeft <= 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Full ACT Exam Simulation</h1>
      <p className="text-gray-500 text-sm mb-8">
        Simulate the real ACT format with per-section timers
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-lg mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Exam Format</h2>
        <div className="space-y-3 mb-6">
          {EXAM_SECTION_ORDER.map((section) => (
            <div key={section} className="flex items-center justify-between text-sm text-gray-600">
              <span className="font-medium">{SECTION_LABELS[section]}</span>
              <span className="text-gray-400">
                {SECTION_QUESTION_COUNTS[section]}q · {Math.round(SECTION_TIME_LIMITS[section] / 60)} min
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-sm font-semibold text-gray-800">
            <span>Total</span>
            <span>215 questions · 175 min</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Complete each section before moving to the next. You can review completed sections. Questions are Claude-generated in authentic ACT style.
          </p>
        </div>

        {slotsLeft !== null && (
          <p className={`text-sm mb-4 font-medium ${noSlotsLeft ? 'text-red-600' : 'text-gray-500'}`}>
            {noSlotsLeft
              ? `All ${MAX_EXAM_SLOTS} exam slots used. Focus on daily quizzes!`
              : `${slotsLeft} exam slot${slotsLeft === 1 ? '' : 's'} remaining`}
          </p>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          onClick={startExam}
          disabled={loading || noSlotsLeft}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Generating exam questions (3–5 min)...' : 'Start Full ACT Exam'}
        </button>
      </div>

      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
