'use client';

import { ACTScoreBreakdown } from '@/types';
import { SECTION_LABELS, Section } from '@/types';

interface ACTScoreGaugeProps {
  scores: ACTScoreBreakdown;
}

function scoreColor(score: number): string {
  if (score >= 30) return 'text-green-600';
  if (score >= 24) return 'text-blue-600';
  if (score >= 18) return 'text-amber-600';
  return 'text-red-500';
}

function scoreBg(score: number): string {
  if (score >= 30) return 'bg-green-50 border-green-200';
  if (score >= 24) return 'bg-blue-50 border-blue-200';
  if (score >= 18) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function ACTScoreGauge({ scores }: ACTScoreGaugeProps) {
  const sections: Section[] = ['english', 'math', 'reading', 'science'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">ACT Score Estimate</h3>

      {/* Composite */}
      <div className="flex flex-col items-center mb-6">
        <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${scoreBg(scores.composite)} border-current`}>
          <span className={`text-4xl font-black ${scoreColor(scores.composite)}`}>{scores.composite}</span>
          <span className="text-xs text-gray-400 font-medium">/ 36</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 font-medium">Composite</p>
      </div>

      {/* Per-section grid */}
      <div className="grid grid-cols-2 gap-3">
        {sections.map((section) => {
          const s = scores[section];
          return (
            <div key={section} className={`rounded-lg border p-3 text-center ${scoreBg(s)}`}>
              <p className={`text-2xl font-bold ${scoreColor(s)}`}>{s}</p>
              <p className="text-xs text-gray-500 mt-0.5">{SECTION_LABELS[section]}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">Based on recent session accuracy</p>
    </div>
  );
}
