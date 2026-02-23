import { Section, Question, SECTION_QUESTION_COUNTS, SECTION_TIME_LIMITS } from '@/types';
import { anthropic } from './client';
import {
  buildEnglishQuizPrompt,
  buildMathQuizPrompt,
  buildReadingQuizPrompt,
  buildScienceQuizPrompt,
} from './prompts';
import { insertQuestion } from '@/lib/db/queries/questions';

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

async function generateSimpleBatch(section: 'english' | 'math', count: number): Promise<Question[]> {
  const prompt = section === 'english'
    ? buildEnglishQuizPrompt(count)
    : buildMathQuizPrompt(count);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const raw = parseJsonResponse<RawQuestion[]>(text);
    return Promise.all(raw.map((q) => buildQuestion(q, section, null)));
  } catch {
    console.error(`[ExamGen] Failed to parse ${section} batch:`, text.slice(0, 200));
    return [];
  }
}

async function generatePassageBatch(
  section: 'reading' | 'science',
  questionsPerPassage: number
): Promise<Question[]> {
  const prompt = section === 'reading'
    ? buildReadingQuizPrompt(questionsPerPassage)
    : buildScienceQuizPrompt(questionsPerPassage);

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  try {
    const response = parseJsonResponse<PassageResponse>(text);
    const sliced = response.questions.slice(0, questionsPerPassage);
    return Promise.all(sliced.map((q) => buildQuestion(q, section, response.passage)));
  } catch {
    console.error(`[ExamGen] Failed to parse ${section} passage batch:`, text.slice(0, 200));
    return [];
  }
}

export interface ExamSections {
  english: { questions: Question[]; timeLimitSeconds: number };
  math: { questions: Question[]; timeLimitSeconds: number };
  reading: { questions: Question[]; timeLimitSeconds: number };
  science: { questions: Question[]; timeLimitSeconds: number };
}

export async function generateFullExam(): Promise<ExamSections> {
  // English: 75 questions in 3 batches of 25
  const englishQuestions: Question[] = [];
  for (let i = 0; i < 3; i++) {
    const batch = await generateSimpleBatch('english', 25);
    englishQuestions.push(...batch);
  }

  // Math: 60 questions in 3 batches of 20
  const mathQuestions: Question[] = [];
  for (let i = 0; i < 3; i++) {
    const batch = await generateSimpleBatch('math', 20);
    mathQuestions.push(...batch);
  }

  // Reading: 40 questions = 8 passages × 5 questions each
  const readingQuestions: Question[] = [];
  for (let i = 0; i < 8; i++) {
    const batch = await generatePassageBatch('reading', 5);
    readingQuestions.push(...batch);
  }

  // Science: 40 questions = 8 passages × 5 questions each
  const scienceQuestions: Question[] = [];
  for (let i = 0; i < 8; i++) {
    const batch = await generatePassageBatch('science', 5);
    scienceQuestions.push(...batch);
  }

  return {
    english: { questions: englishQuestions, timeLimitSeconds: SECTION_TIME_LIMITS.english },
    math: { questions: mathQuestions, timeLimitSeconds: SECTION_TIME_LIMITS.math },
    reading: { questions: readingQuestions, timeLimitSeconds: SECTION_TIME_LIMITS.reading },
    science: { questions: scienceQuestions, timeLimitSeconds: SECTION_TIME_LIMITS.science },
  };
}
