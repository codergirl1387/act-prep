'use client';

import { Section, SECTION_LABELS, SECTION_QUESTION_COUNTS } from '@/types';

interface SectionNavProps {
  currentSection: Section;
  completedSections: Set<Section>;
  sectionAnswerCounts: Record<Section, number>;
  onNavigate: (section: Section) => void;
}

export function SectionNav({
  currentSection,
  completedSections,
  sectionAnswerCounts,
  onNavigate,
}: SectionNavProps) {
  const sections: Section[] = ['english', 'math', 'reading', 'science'];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {sections.map((section) => {
        const isCompleted = completedSections.has(section);
        const isCurrent = section === currentSection;
        const answered = sectionAnswerCounts[section] ?? 0;
        const total = SECTION_QUESTION_COUNTS[section];

        return (
          <button
            key={section}
            onClick={() => isCompleted && onNavigate(section)}
            disabled={!isCompleted && !isCurrent}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex flex-col items-center min-w-[90px]
              ${isCurrent
                ? 'bg-blue-600 text-white'
                : isCompleted
                ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            <span>{SECTION_LABELS[section]}</span>
            <span className="text-xs font-normal opacity-80">{answered}/{total}</span>
          </button>
        );
      })}
    </div>
  );
}
