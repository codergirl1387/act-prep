import { Section, StudyCard } from '@/types';
import { anthropic } from './client';
import { buildFlashcardPrompt } from './prompts';
import { getTopicWeights, sampleTopicsByWeight } from '@/lib/utils/adaptive-weights';
import { insertCards, getTodayCards } from '@/lib/db/queries/flashcards';
import { todayString } from '@/lib/utils/date';
import { DAILY_FLASHCARD_COUNT } from '@/lib/utils/sections';

interface RawCard {
  front: string;
  back: string;
}

async function generateCardsForSection(section: Section, count: number): Promise<RawCard[]> {
  const prompt = buildFlashcardPrompt(section, count);
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const cards = JSON.parse(cleaned) as RawCard[];
    return Array.isArray(cards) ? cards : [];
  } catch {
    console.error('[Flashcards] Failed to parse response for section:', section, text.slice(0, 200));
    return [];
  }
}

export async function generateDailyFlashcards(date?: string): Promise<StudyCard[]> {
  const today = date ?? todayString();

  const existing = await getTodayCards(today);
  if (existing.length > 0) return existing;

  const weights = await getTopicWeights();
  const sampledSections = sampleTopicsByWeight(weights, DAILY_FLASHCARD_COUNT) as Section[];

  const sectionCounts = new Map<Section, number>();
  for (const s of sampledSections) {
    sectionCounts.set(s, (sectionCounts.get(s) ?? 0) + 1);
  }

  const allCards: Omit<StudyCard, 'id' | 'createdAt'>[] = [];
  for (const [section, count] of sectionCounts) {
    const rawCards = await generateCardsForSection(section, count);
    for (const card of rawCards) {
      allCards.push({
        topic: section,
        front: card.front,
        back: card.back,
        generatedDate: today,
        source: 'claude',
      });
    }
  }

  await insertCards(allCards);
  return getTodayCards(today);
}

export async function ensureDailyFlashcards(): Promise<StudyCard[]> {
  return generateDailyFlashcards();
}
