export {
  SECTIONS,
  SECTION_LABELS,
  SECTION_COLORS,
  SECTION_QUESTION_COUNTS,
  SECTION_TIME_LIMITS,
  EXAM_SECTION_ORDER,
  FULL_EXAM_TIME_SECONDS,
} from '@/types';

// Daily quiz: 20 questions proportional to real ACT (215 total)
// english=75/215≈35%, math=60/215≈28%, reading=40/215≈19%, science=40/215≈19%
// Rounded to 20: english=7, math=5, reading=4, science=4
export const QUIZ_SECTION_DISTRIBUTION: Record<string, number> = {
  english: 7,
  math: 5,
  reading: 4,
  science: 4,
};

export const QUIZ_QUESTION_COUNT = 20;
export const QUIZ_TIME_SECONDS = 20 * 60; // 20 minutes

export const DAILY_FLASHCARD_COUNT = 8; // 2 per section

export const MAX_EXAM_SLOTS = 6;
