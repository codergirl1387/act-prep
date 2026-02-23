import { ACTScoreBreakdown, Section, TopicBreakdown } from '@/types';

export function accuracyToACTScore(accuracyPercent: number): number {
  if (accuracyPercent >= 95) return 36;
  if (accuracyPercent >= 92) return 35;
  if (accuracyPercent >= 90) return 34;
  if (accuracyPercent >= 87) return 33;
  if (accuracyPercent >= 85) return 32;
  if (accuracyPercent >= 83) return 31;
  if (accuracyPercent >= 80) return 30;
  if (accuracyPercent >= 77) return 29;
  if (accuracyPercent >= 75) return 28;
  if (accuracyPercent >= 73) return 27;
  if (accuracyPercent >= 70) return 26;
  if (accuracyPercent >= 67) return 25;
  if (accuracyPercent >= 65) return 24;
  if (accuracyPercent >= 63) return 23;
  if (accuracyPercent >= 60) return 22;
  if (accuracyPercent >= 57) return 21;
  if (accuracyPercent >= 55) return 20;
  if (accuracyPercent >= 52) return 19;
  if (accuracyPercent >= 50) return 18;
  if (accuracyPercent >= 47) return 17;
  if (accuracyPercent >= 44) return 16;
  if (accuracyPercent >= 40) return 15;
  if (accuracyPercent >= 36) return 14;
  if (accuracyPercent >= 32) return 13;
  if (accuracyPercent >= 28) return 12;
  if (accuracyPercent >= 24) return 11;
  if (accuracyPercent >= 20) return 10;
  return Math.max(1, Math.floor(accuracyPercent / 3));
}

export function computeACTScores(topicBreakdown: TopicBreakdown): ACTScoreBreakdown {
  const sections: Section[] = ['english', 'math', 'reading', 'science'];
  const sectionScores: Partial<ACTScoreBreakdown> = {};
  let totalScore = 0;
  let sectionCount = 0;

  for (const section of sections) {
    const data = topicBreakdown[section];
    if (data && data.total > 0) {
      const accuracy = (data.correct / data.total) * 100;
      const score = accuracyToACTScore(accuracy);
      sectionScores[section] = score;
      totalScore += score;
      sectionCount++;
    } else {
      sectionScores[section] = 0;
    }
  }

  const composite = sectionCount > 0 ? Math.round(totalScore / sectionCount) : 0;

  return {
    english: sectionScores.english ?? 0,
    math: sectionScores.math ?? 0,
    reading: sectionScores.reading ?? 0,
    science: sectionScores.science ?? 0,
    composite,
  };
}
