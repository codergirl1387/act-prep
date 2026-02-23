import { Section, SECTION_LABELS, Question } from '@/types';

// ─── ENGLISH ─────────────────────────────────────────────────────────────────
export function buildEnglishQuizPrompt(count: number): string {
  return `You are an expert ACT English tutor. Generate ${count} ACT-style English questions.

Each question presents a 2-3 sentence passage excerpt where one portion is underlined (marked with [UNDERLINE]...[/UNDERLINE]). The student must choose the best revision of the underlined portion. Option A is always "NO CHANGE."

Cover a mix of: subject-verb agreement, pronoun case/agreement, verb tense consistency, comma usage, apostrophes, colons/semicolons, transitions, redundancy, relevance, and sentence structure.

Return ONLY a valid JSON array with no other text:
[
  {
    "questionText": "The passage reads: '[UNDERLINE]The team of engineers have[/UNDERLINE] completed the bridge design ahead of schedule.' Which choice best corrects the underlined portion?",
    "optionA": "NO CHANGE",
    "optionB": "The team of engineers has",
    "optionC": "The team of engineers, having",
    "optionD": "Engineers on the team have",
    "correctAnswer": "B",
    "explanation": "The subject 'team' is singular, so it requires the singular verb 'has,' not the plural 'have.'",
    "difficulty": "medium"
  }
]`;
}

// ─── MATH ─────────────────────────────────────────────────────────────────────
export function buildMathQuizPrompt(count: number): string {
  const subtopics = [
    'pre-algebra (ratios, percentages, averages, number properties)',
    'elementary algebra (linear equations, inequalities, absolute value)',
    'intermediate algebra (quadratics, systems of equations, functions, logarithms)',
    'coordinate geometry (slope, distance, midpoint, circles, parabolas)',
    'plane geometry (triangles, circles, area, volume, special right triangles)',
    'trigonometry (sine, cosine, tangent, SOHCAHTOA, unit circle, trig identities)',
  ];
  const subtopic = subtopics[Math.floor(Math.random() * subtopics.length)];

  return `You are an expert ACT Math tutor. Generate ${count} ACT-style Math question(s) focusing on: ${subtopic}.

Requirements:
- Questions should be challenging but solvable in 1-2 minutes
- Use concrete numbers when possible
- Answer choices should be plausible distractors (common calculation errors)
- Describe any geometric figures in text if needed (e.g. "In triangle ABC, angle A = 90 degrees...")

Return ONLY a valid JSON array with no other text:
[
  {
    "questionText": "If 3x - 7 = 2x + 5, what is the value of x?",
    "optionA": "12",
    "optionB": "-2",
    "optionC": "2",
    "optionD": "-12",
    "correctAnswer": "A",
    "explanation": "Subtract 2x from both sides: x - 7 = 5. Add 7 to both sides: x = 12.",
    "difficulty": "easy"
  }
]`;
}

// ─── READING ──────────────────────────────────────────────────────────────────
export function buildReadingQuizPrompt(questionCount: number): string {
  const genres = [
    'literary narrative (a fiction excerpt from a novel or short story)',
    'social science (psychology, economics, or sociology article)',
    'humanities (history, biography, or arts essay)',
    'natural science (biology, physics, or environmental science article)',
  ];
  const genre = genres[Math.floor(Math.random() * genres.length)];

  return `You are an expert ACT Reading tutor. Generate a mini reading passage and ${questionCount} comprehension questions.

Genre: ${genre}

The passage should be 150-200 words. Questions must test a variety of skills:
- Main idea / central purpose of the passage
- Specific detail (a fact stated directly in the passage)
- Inference (what can be logically inferred)
- Vocabulary in context (what a word means AS USED in the passage)
- Author's purpose or tone

Return ONLY a valid JSON object (not an array) with this exact structure:
{
  "passage": "Full 150-200 word passage text here...",
  "questions": [
    {
      "questionText": "The primary purpose of this passage is to...",
      "optionA": "argue that...",
      "optionB": "describe the process of...",
      "optionC": "compare two theories of...",
      "optionD": "refute the claim that...",
      "correctAnswer": "B",
      "explanation": "The passage focuses on describing the process step by step, using phrases like 'first' and 'then.' There is no argument, comparison, or refutation.",
      "difficulty": "medium"
    }
  ]
}`;
}

// ─── SCIENCE ─────────────────────────────────────────────────────────────────
export function buildScienceQuizPrompt(questionCount: number): string {
  const scienceType = Math.random() > 0.5 ? 'data_representation' : 'research_summaries';

  if (scienceType === 'data_representation') {
    return `You are an expert ACT Science tutor. Generate a Data Representation passage and ${questionCount} questions.

Create a scientific data table with specific numeric values. Present it as text (column headers with rows of data). Choose any topic from: biology, chemistry, physics, or earth science.

Questions should test: reading values from the table, identifying trends, interpolating/extrapolating, comparing conditions.

Return ONLY a valid JSON object with this exact structure:
{
  "passage": "Table 1 shows the relationship between temperature (degrees C) and enzyme activity rate (nmol/min) for Enzyme X.\\n\\nTemperature (C) | Activity Rate (nmol/min)\\n20              | 12.3\\n30              | 24.7\\n37              | 45.2\\n42              | 38.1\\n50              | 8.4\\n60              | 1.2",
  "questions": [
    {
      "questionText": "According to Table 1, at which temperature does Enzyme X show the highest activity rate?",
      "optionA": "30 degrees C",
      "optionB": "37 degrees C",
      "optionC": "42 degrees C",
      "optionD": "50 degrees C",
      "correctAnswer": "B",
      "explanation": "The table shows 45.2 nmol/min at 37 degrees C, which is the highest value in the Activity Rate column.",
      "difficulty": "easy"
    }
  ]
}`;
  } else {
    return `You are an expert ACT Science tutor. Generate a Research Summaries passage and ${questionCount} questions.

Describe a concise experiment: hypothesis (1 sentence), method (2-3 sentences with specific variables), and results (2-3 sentences with specific measurements). Choose any topic from: biology, chemistry, physics, or earth science.

Questions should test: understanding experimental design, interpreting results, identifying the independent/dependent variable, drawing valid conclusions, identifying controls.

Return ONLY a valid JSON object with this exact structure:
{
  "passage": "Hypothesis: ... Method: ... Results: ...",
  "questions": [
    {
      "questionText": "In the experiment, what is the independent variable?",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "correctAnswer": "A",
      "explanation": "...",
      "difficulty": "medium"
    }
  ]
}`;
  }
}

// ─── FLASHCARD PROMPTS ────────────────────────────────────────────────────────
export function buildFlashcardPrompt(section: Section, count: number): string {
  const sectionGuides: Record<Section, string> = {
    english: `Focus on ACT English rules and strategies. Topics include:
- Grammar rules: subject-verb agreement, pronoun case, verb tense consistency, modifier placement
- Punctuation: when to use commas (FANBOYS, introductory clauses, lists), apostrophes, semicolons, colons
- Rhetorical skills: transitions, redundancy, relevance, essay structure
Example front: "When should a semicolon be used between two clauses?"
Example back: "Use a semicolon to join two independent clauses WITHOUT a coordinating conjunction (FANBOYS). Both clauses must be complete sentences. Example: She studied hard; she passed the exam."`,

    math: `Focus on formulas and concepts Netra must know for ACT Math. Topics include:
- Arithmetic: percentages, ratios, averages, absolute value
- Algebra: solving equations/inequalities, quadratic formula, FOIL, systems of equations
- Geometry: area/perimeter of shapes, Pythagorean theorem, special right triangles (30-60-90, 45-45-90), circle formulas
- Trig: SOHCAHTOA, key unit circle values, basic identities
Example front: "What is the quadratic formula?"
Example back: "x = (-b ± sqrt(b^2 - 4ac)) / 2a. Used to solve ax^2 + bx + c = 0. The discriminant (b^2 - 4ac) tells you: positive = 2 real roots, zero = 1 root, negative = no real roots."`,

    reading: `Focus on ACT Reading strategies and question-type approaches. Topics include:
- How to find the main idea vs. supporting details
- How to approach vocabulary-in-context questions (go back to passage, try each choice in context)
- How to identify the author's tone and purpose
- How to make inferences (what must be true based on the passage)
- Reading strategies: skimming vs. close reading, annotating
Example front: "How do you approach a vocabulary-in-context question?"
Example back: "1) Go back to the passage and find the word. 2) Re-read 2-3 sentences around it. 3) Cover the word and predict what it means from context. 4) Try each answer choice in the sentence — choose the one that preserves the original meaning. Never rely on the word's common definition alone."`,

    science: `Focus on ACT Science strategies and key scientific reasoning skills. Topics include:
- How to read data tables and graphs (x-axis, y-axis, trends, outliers)
- How to identify independent variable (what researcher changes) vs. dependent variable (what is measured) vs. control
- Research Summaries: how to evaluate experimental conclusions
- Conflicting Viewpoints: how to identify what scientists agree/disagree about
- Key concepts: what a control group is, direct vs. inverse relationships
Example front: "What is the independent variable in an experiment?"
Example back: "The independent variable is what the researcher deliberately CHANGES or controls in an experiment. It goes on the x-axis. The dependent variable is what is MEASURED in response. Example: Testing how temperature affects reaction rate — temperature is independent, reaction rate is dependent."`,
  };

  return `You are an expert ACT tutor creating flashcards for the ${SECTION_LABELS[section]} section.

${sectionGuides[section]}

Generate ${count} high-quality flashcard(s). Each card should require genuine understanding and be immediately useful for ACT prep.

Return ONLY a valid JSON array with no other text:
[
  {
    "front": "Clear, specific question or concept (max 120 chars)",
    "back": "Complete explanation with the rule, an example, and any exceptions (max 350 chars)"
  }
]`;
}

// ─── EXPLANATION PROMPT ───────────────────────────────────────────────────────
export function buildExplanationPrompt(question: Question): string {
  const sectionName = SECTION_LABELS[question.topic as Section] ?? question.topic;
  const passageBlock = question.passageContext
    ? `\nContext/Passage:\n${question.passageContext}\n`
    : '';

  return `You are an ACT ${sectionName} tutor helping a student understand a missed question.
${passageBlock}
Question: ${question.questionText}

Options:
A) ${question.optionA}
B) ${question.optionB}
C) ${question.optionC}
D) ${question.optionD}

Correct Answer: ${question.correctAnswer}

Explain clearly why ${question.correctAnswer} is correct and briefly why the other options are wrong. Reference the specific ACT ${sectionName} rule, strategy, or concept being tested. Keep it to 3-5 sentences.`;
}
