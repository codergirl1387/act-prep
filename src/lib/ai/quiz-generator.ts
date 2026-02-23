import { Section, Question } from '@/types';
import { anthropic } from './client';
import {
  buildEnglishQuizPrompt,
  buildMathQuizPrompt,
  buildReadingQuizPrompt,
  buildScienceQuizPrompt,
} from './prompts';
import { insertQuestion } from '@/lib/db/queries/questions';
import { createSession, getTodayQuizSession } from '@/lib/db/queries/sessions';
import { QUIZ_SECTION_DISTRIBUTION, QUIZ_TIME_SECONDS } from '@/lib/utils/sections';

interface RawQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: string;
}

interface PassageResponse {
  passage: string;
  questions: RawQuestion[];
}

function parseJsonResponse<T>(text: string): T {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as T;
}

async function buildQuestion(
  raw: RawQuestion,
  section: Section,
  passageContext: string | null
): Promise<Question> {
  const id = await insertQuestion({
    source: 'Claude-generated',
    sourceYear: null,
    topic: section,
    difficulty: (raw.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    questionText: raw.questionText,
    optionA: raw.optionA,
    optionB: raw.optionB,
    optionC: raw.optionC,
    optionD: raw.optionD,
    correctAnswer: raw.correctAnswer,
    explanation: raw.explanation,
    passageContext,
    pageNumber: null,
  });
  return {
    id,
    source: 'Claude-generated',
    sourceYear: null,
    topic: section,
    difficulty: (raw.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
    questionText: raw.questionText,
    optionA: raw.optionA,
    optionB: raw.optionB,
    optionC: raw.optionC,
    optionD: raw.optionD,
    correctAnswer: raw.correctAnswer,
    explanation: raw.explanation,
    passageContext,
    pageNumber: null,
    createdAt: new Date().toISOString(),
  };
}

async function generateSimpleQuestions(
  section: 'english' | 'math',
  count: number
): Promise<Question[]> {
  const prompt = section === 'english'
    ? buildEnglishQuizPrompt(count)
    : buildMathQuizPrompt(count);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const raw = parseJsonResponse<RawQuestion[]>(text);
    return Promise.all(raw.map((q) => buildQuestion(q, section, null)));
  } catch {
    console.error(`[Quiz] Failed to parse ${section} questions:`, text.slice(0, 200));
    return [];
  }
}

async function generatePassageQuestions(
  section: 'reading' | 'science',
  count: number
): Promise<Question[]> {
  const prompt = section === 'reading'
    ? buildReadingQuizPrompt(count)
    : buildScienceQuizPrompt(count);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const response = parseJsonResponse<PassageResponse>(text);
    const sliced = response.questions.slice(0, count);
    return Promise.all(sliced.map((q) => buildQuestion(q, section, response.passage)));
  } catch {
    console.error(`[Quiz] Failed to parse ${section} questions:`, text.slice(0, 200));
    return [];
  }
}

export async function generateDailyQuiz(): Promise<{ sessionId: number; questions: Question[] }> {
  const existing = await getTodayQuizSession();
  if (existing) return { sessionId: existing.id, questions: [] };

  const distribution = QUIZ_SECTION_DISTRIBUTION;
  const allQuestions: Question[] = [];

  if (distribution.english > 0) {
    const q = await generateSimpleQuestions('english', distribution.english);
    allQuestions.push(...q);
  }
  if (distribution.math > 0) {
    const q = await generateSimpleQuestions('math', distribution.math);
    allQuestions.push(...q);
  }
  if (distribution.reading > 0) {
    const q = await generatePassageQuestions('reading', distribution.reading);
    allQuestions.push(...q);
  }
  if (distribution.science > 0) {
    const q = await generatePassageQuestions('science', distribution.science);
    allQuestions.push(...q);
  }

  // Shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  const sessionId = await createSession('quiz', QUIZ_TIME_SECONDS);
  return { sessionId, questions: allQuestions };
}
