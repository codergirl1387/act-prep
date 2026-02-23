'use client';

import { SECTION_LABELS, Section } from '@/types';

interface SectionHeatmapProps {
  // section -> accuracy percentage 0-100
  breakdown: Record<string, number>;
}

function cellColor(accuracy: number | undefined): string {
  if (accuracy === undefined) return 'bg-gray-100 text-gray-400';
  if (accuracy >= 85) return 'bg-green-100 text-green-800';
  if (accuracy >= 70) return 'bg-blue-100 text-blue-800';
  if (accuracy >= 55) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
}

export function SectionHeatmap({ breakdown }: SectionHeatmapProps) {
  const sections: Section[] = ['english', 'math', 'reading', 'science'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Section Accuracy</h3>
      <div className="grid grid-cols-2 gap-3">
        {sections.map((section) => {
          const acc = breakdown[section];
          return (
            <div key={section} className={`rounded-lg p-4 ${cellColor(acc)}`}>
              <p className="text-sm font-semibold">{SECTION_LABELS[section]}</p>
              <p className="text-2xl font-bold mt-1">
                {acc !== undefined ? `${Math.round(acc)}%` : '—'}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 flex-wrap">
        <span className="text-xs flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-200 inline-block" />≥85%</span>
        <span className="text-xs flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-200 inline-block" />70–84%</span>
        <span className="text-xs flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-200 inline-block" />55–69%</span>
        <span className="text-xs flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-200 inline-block" />&lt;55%</span>
      </div>
    </div>
  );
}
