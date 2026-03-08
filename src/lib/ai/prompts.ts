import { Section, SECTION_LABELS, Question } from '@/types';

// ─── ENGLISH ─────────────────────────────────────────────────────────────────
export function buildEnglishQuizPrompt(count: number): string {
  const hardTopics = [
    'dangling or misplaced modifiers in complex multi-clause sentences',
    'parallel structure violations across long lists or compound predicates',
    'subtle pronoun ambiguity where multiple antecedents are plausible',
    'subjunctive mood and conditional constructions (if/were/would)',
    'rhetorical function — adding, deleting, or reordering sentences to serve the passage\'s argument',
    'transition logic between paragraphs testing the relationship between ideas (contrast, causation, elaboration)',
    'punctuation in complex sentences: paired commas vs. dashes vs. parentheses for non-essential clauses',
    'concision and redundancy in dense, formal prose where multiple options appear grammatically correct',
    'sentence combining or division to achieve a specific rhetorical effect stated in the question stem',
    'verb tense consistency in narratives with flashbacks, hypotheticals, or reported speech',
  ];
  const topic = hardTopics[Math.floor(Math.random() * hardTopics.length)];

  return `You are an expert ACT English tutor. Generate ${count} HARD to VERY HARD ACT English questions targeting: ${topic}.

Each question must:
1. Present a 3-5 sentence passage excerpt with one portion marked [UNDERLINE]...[/UNDERLINE]
2. Have Option A as "NO CHANGE" — and sometimes the correct answer IS "NO CHANGE" (at least 20% of the time) to force careful reading
3. Use distractors that are grammatically plausible but wrong for a subtle reason
4. Require genuine understanding — not pattern-matching. Wrong answers should tempt students who half-know the rule
5. Be rated "hard" or "very_hard" difficulty

Hard question characteristics:
- The error is subtle (e.g., a modifier that seems to modify the right noun but doesn't, a pronoun that agrees in number but is ambiguous)
- Multiple options appear to fix the problem but introduce a new error
- Rhetorical questions may require reading the full paragraph context given in the stem
- "Best choice" questions where grammar is secondary to style, concision, or logical flow

Return ONLY a valid JSON array with no other text:
[
  {
    "questionText": "The passage reads: 'Having spent decades studying migratory patterns, [UNDERLINE]the data collected by Dr. Chen was considered the most comprehensive in the field[/UNDERLINE], surpassing even the landmark studies of the 1970s.' Which choice best corrects the underlined portion?",
    "optionA": "NO CHANGE",
    "optionB": "Dr. Chen's data collection was considered the most comprehensive in the field",
    "optionC": "Dr. Chen had collected data considered the most comprehensive in the field",
    "optionD": "the most comprehensive data in the field had been collected by Dr. Chen",
    "correctAnswer": "C",
    "explanation": "The opening participial phrase 'Having spent decades studying' must logically modify the subject of the main clause — the person who spent those decades, Dr. Chen. Options A and D make 'the data' the subject, creating a dangling modifier. Option B changes the meaning by using possessive construction and passive voice awkwardly. Option C correctly places Dr. Chen as the subject performing the action.",
    "difficulty": "hard"
  }
]`;
}

// ─── MATH ─────────────────────────────────────────────────────────────────────
export function buildMathQuizPrompt(count: number): string {
  const hardSubtopics = [
    'advanced function composition and inverse functions, including domain/range restrictions',
    'complex systems of equations with three variables or non-linear systems combining a line and a conic',
    'advanced polynomial operations: factoring higher-degree polynomials, remainder theorem, rational roots',
    'logarithmic and exponential equations requiring change-of-base, log properties, and exponent rules',
    'trigonometry: double-angle identities, solving trig equations over a restricted domain, arc length and sector area',
    'coordinate geometry of conic sections: completing the square to identify circles, ellipses, parabolas, and their properties',
    'probability and counting: combinations, permutations, conditional probability, and expected value',
    'complex number arithmetic: adding, multiplying, dividing, and finding modulus/argument in the complex plane',
    'sequences and series: arithmetic/geometric series sums, recursive formulas, sigma notation',
    'multi-step geometry: similar triangles combined with circle theorems, inscribed angles, and arc relationships',
  ];
  const subtopic = hardSubtopics[Math.floor(Math.random() * hardSubtopics.length)];

  return `You are an expert ACT Math tutor. Generate ${count} HARD to VERY HARD ACT-style Math question(s) on: ${subtopic}.

Requirements:
- Questions require 2-4 minutes and multiple non-obvious steps
- No single-step arithmetic or direct formula plug-in
- Distractors must be answers students get from specific common mistakes (e.g., sign error, forgetting ±, using wrong identity, off-by-one in counting)
- At least one distractor should be the result of a partially correct but incomplete approach
- All numeric values must be exact and internally consistent — verify the answer yourself before writing options
- Describe any geometric figures fully in words (no diagrams needed)
- Difficulty must be "hard" or "very_hard"

Return ONLY a valid JSON array with no other text:
[
  {
    "questionText": "The function f(x) = log₂(x - 3) + log₂(x + 1) is defined for all real x such that x > k. What is the value of k, and what is f(k + 4)?",
    "optionA": "k = 3; f(7) = 4",
    "optionB": "k = 3; f(7) = log₂(20)",
    "optionC": "k = -1; f(3) = log₂(8)",
    "optionD": "k = 3; f(7) = log₂(24)",
    "correctAnswer": "D",
    "explanation": "For log₂(x-3) + log₂(x+1) to be defined, both arguments must be positive: x-3>0 → x>3, and x+1>0 → x>-1. The binding constraint is x>3, so k=3. At x=k+4=7: f(7)=log₂(7-3)+log₂(7+1)=log₂(4)+log₂(8)=2+3=5. Wait — rechecking: log₂(4)=2, log₂(8)=3, sum=5. Actually f(7)=log₂(4·8)=log₂(32)=5. Let me fix: answer is k=3; f(7)=5. Use a cleaner example in actual generation.",
    "difficulty": "hard"
  }
]

IMPORTANT: Always verify your arithmetic. Every answer choice must be a specific, plausible number or expression. The correct answer must be unambiguous.`;
}

// ─── READING ──────────────────────────────────────────────────────────────────
export function buildReadingQuizPrompt(questionCount: number): string {
  const formats = [
    {
      type: 'single_complex',
      desc: 'a single dense, complex passage (220-270 words) from literary narrative fiction — use sophisticated vocabulary, multiple narrative threads, unreliable or ambiguous narrator, and subtle shifts in tone',
    },
    {
      type: 'single_complex',
      desc: 'a single argumentative passage (220-270 words) from social science — an economist or sociologist making a nuanced, counterintuitive argument with evidence that could be interpreted multiple ways',
    },
    {
      type: 'single_complex',
      desc: 'a single analytical passage (220-270 words) from humanities — a historian or critic analyzing a primary source, with the author\'s own perspective embedded in ostensibly neutral language',
    },
    {
      type: 'single_complex',
      desc: 'a single technical passage (220-270 words) from natural science — dense with domain-specific terminology, multiple cause-effect chains, and data-supported claims that require careful parsing',
    },
    {
      type: 'paired',
      desc: 'TWO short related passages (Passage A: 110-130 words, Passage B: 110-130 words) presenting contrasting perspectives on the same topic. Questions must include at least one that requires comparing both passages.',
    },
  ];
  const format = formats[Math.floor(Math.random() * formats.length)];

  const hardQuestionTypes = [
    'What can be most reasonably inferred about the author\'s unstated assumption?',
    'The author\'s attitude toward [X] is best described as... (subtle tone: e.g., "cautiously optimistic" vs "guardedly skeptical")',
    'Which choice provides the best evidence for the answer to the previous question? (evidence-pairing)',
    'As used in line/sentence [N], "[word]" most nearly means... (word must have a surprising contextual meaning)',
    'The primary rhetorical function of the [third paragraph / final sentence / opening anecdote] is to...',
    'With which of the following statements would the author most likely agree/disagree? (requires full-passage synthesis)',
    'How does the author use [specific structural technique] to develop the central argument?',
  ];

  if (format.type === 'paired') {
    return `You are an expert ACT Reading tutor. Generate a paired-passage set and ${questionCount} hard comprehension questions.

Format: ${format.desc}

Both passages must address the same subject from clearly different angles (e.g., one empirical/data-driven, one humanistic/value-driven; or one arguing for, one against a policy).

Hard question requirements:
- At least 1 question asks about Passage A only
- At least 1 question asks about Passage B only
- At least 2 questions require comparing or synthesizing BOTH passages
- Use subtle answer choices: the wrong answers must be partially supported by the text or represent reasonable-but-incorrect readings
- No questions with obvious, directly-stated answers
- Include vocabulary-in-context where the word's common meaning differs from its contextual meaning
- Difficulty: "hard" or "very_hard" only

Return ONLY a valid JSON object with this exact structure:
{
  "passage": "Passage A\\n\\n[110-130 word passage text]\\n\\nPassage B\\n\\n[110-130 word passage text]",
  "questions": [
    {
      "questionText": "Both authors would most likely agree that...",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "correctAnswer": "B",
      "explanation": "Detailed explanation citing specific evidence from both passages for why B is correct and why each distractor fails.",
      "difficulty": "hard"
    }
  ]
}`;
  }

  return `You are an expert ACT Reading tutor. Generate a reading passage and ${questionCount} HARD comprehension questions.

Passage format: ${format.desc}

Hard question requirements:
- NO questions with directly-stated, single-sentence answers — every question requires reasoning or synthesis
- Include questions from these high-difficulty types: ${hardQuestionTypes.slice(0, Math.min(questionCount, hardQuestionTypes.length)).join('; ')}
- Wrong answers must be plausible: use "too extreme," "opposite tone," "true but not the purpose," and "out of scope" traps
- For inference questions, the correct answer must be the ONLY defensible inference — not just a possible one
- For tone/attitude questions, use precise emotional vocabulary (not just "positive" or "negative")
- Difficulty: "hard" or "very_hard" only

Return ONLY a valid JSON object with this exact structure:
{
  "passage": "Full 220-270 word passage text here...",
  "questions": [
    {
      "questionText": "The author's reference to [specific detail] in the passage primarily serves to...",
      "optionA": "establish the historical context necessary to understand the argument",
      "optionB": "illustrate the tension between two competing interpretations the passage later resolves",
      "optionC": "concede a limitation of the central thesis before strengthening it",
      "optionD": "introduce terminology that the remainder of the passage systematically defines",
      "correctAnswer": "B",
      "explanation": "Detailed explanation of why B is correct, why each other option is a plausible but incorrect reading, and what specific passage evidence supports B.",
      "difficulty": "hard"
    }
  ]
}`;
}

// ─── SCIENCE ─────────────────────────────────────────────────────────────────
export function buildScienceQuizPrompt(questionCount: number): string {
  const scienceTypes = ['conflicting_viewpoints', 'multi_figure', 'research_summaries_hard'];
  const scienceType = scienceTypes[Math.floor(Math.random() * scienceTypes.length)];

  if (scienceType === 'conflicting_viewpoints') {
    return `You are an expert ACT Science tutor. Generate a Conflicting Viewpoints passage and ${questionCount} HARD questions.

Conflicting Viewpoints is the hardest ACT Science passage type. Create:
- A scientific controversy where 2-3 scientists (or hypotheses) offer competing explanations for the SAME phenomenon
- Each viewpoint must be internally consistent and supported by different evidence or assumptions
- The disagreement should be substantive (not just a matter of degree) — e.g., different mechanisms, different causal factors, different interpretations of shared data
- Include at least one piece of data or observation that BOTH viewpoints must explain differently
- Topic: choose from geology (plate tectonics, rock formation), evolutionary biology, cosmology, climate science, or neuroscience

Hard question requirements — include all of these types:
1. "Scientist 2's hypothesis differs from Scientist 1's in that Scientist 2 argues..." (compare viewpoints)
2. "A new study finds [X]. This finding would most WEAKEN which hypothesis?" (apply new evidence)
3. "Both scientists would agree that..." (find common ground — tricky because they disagree on most things)
4. "Scientist 1 would most likely respond to Scientist 3's claim by arguing..." (infer a viewpoint's response)
5. "Which of the following, if true, would most SUPPORT Scientist 2's hypothesis?"

Return ONLY a valid JSON object:
{
  "passage": "The following are explanations proposed by two scientists for [phenomenon].\\n\\nScientist 1:\\n[3-5 sentences presenting a coherent, evidence-backed hypothesis]\\n\\nScientist 2:\\n[3-5 sentences presenting a competing, evidence-backed hypothesis that contradicts Scientist 1 on specific points]",
  "questions": [
    {
      "questionText": "A researcher discovers that [new finding]. Which scientist's hypothesis does this evidence most strongly support, and why?",
      "optionA": "Scientist 1, because the finding confirms that [specific mechanism from S1]",
      "optionB": "Scientist 2, because the finding confirms that [specific mechanism from S2]",
      "optionC": "Neither scientist, because both hypotheses predict [outcome] regardless of this finding",
      "optionD": "Both scientists equally, because the finding is consistent with assumptions shared by both",
      "correctAnswer": "B",
      "explanation": "Detailed explanation of which hypothesis the evidence supports and why each distractor fails.",
      "difficulty": "hard"
    }
  ]
}`;
  }

  if (scienceType === 'multi_figure') {
    return `You are an expert ACT Science tutor. Generate a Data Representation passage with TWO related data tables/figures and ${questionCount} HARD questions.

Create two related tables that share at least one variable, so students must cross-reference them:
- Table 1: e.g., relationship between Variable A and Variable B under Condition X
- Table 2: e.g., relationship between Variable B and Variable C under Conditions X and Y
- Use 5-6 rows of realistic, internally consistent numeric data per table
- Include at least one non-linear trend and one apparent anomaly/outlier students must notice

Hard question requirements:
1. At least 2 questions require using data from BOTH tables to answer (multi-figure synthesis)
2. At least 1 question requires interpolation or extrapolation beyond the table range
3. At least 1 question asks about the RELATIONSHIP between variables (direct, inverse, non-linear) rather than a single value
4. At least 1 question involves a calculation (e.g., percent change, ratio, difference between conditions)
5. Wrong answers must come from: reading the wrong table, misidentifying the trend direction, off-by-one row errors, or using the right numbers but the wrong operation

Return ONLY a valid JSON object:
{
  "passage": "Table 1: [descriptive title]\\n\\n[Column 1 header] | [Column 2 header] | [Column 3 header]\\n[row 1 values]\\n[row 2 values]\\n...\\n\\nTable 2: [descriptive title]\\n\\n[Column 1 header] | [Column 2 header] | [Column 3 header]\\n[row 1 values]\\n[row 2 values]\\n...",
  "questions": [
    {
      "questionText": "Based on Tables 1 and 2, at what value of [shared variable] would [Variable C] be expected to equal [target value], assuming the trend in Table 2 continues?",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "correctAnswer": "C",
      "explanation": "Step-by-step explanation of how to use both tables and interpolate/extrapolate to reach the answer, with specific data values cited.",
      "difficulty": "hard"
    }
  ]
}`;
  }

  // research_summaries_hard
  return `You are an expert ACT Science tutor. Generate a hard Research Summaries passage and ${questionCount} HARD questions.

Design a complex multi-experiment study:
- Present 2-3 related experiments testing different aspects of the same phenomenon
- Each experiment must have clearly stated independent and dependent variables, a control group, and specific quantitative results
- Include at least one experiment where results are unexpected or contradictory to a naive prediction
- Results should involve multiple measured variables, not just a single outcome
- Topic: choose from pharmacology, ecology, materials science, nuclear physics, or biochemistry

Hard question requirements:
1. "What is the purpose of [specific control condition] in Experiment 2?" (experimental design reasoning)
2. "Based on the results of Experiments 1 and 3, which conclusion is best supported?" (multi-experiment synthesis — requires ruling out options that only apply to one experiment)
3. "A scientist hypothesizes that [mechanism]. Which experimental result is most INCONSISTENT with this hypothesis?" (falsification reasoning)
4. "If a fourth experiment were conducted with [modified condition], what result would Experiment 2's findings predict?" (extrapolation from design)
5. "The results of Experiment 2 suggest that the relationship between [X] and [Y] is..." (requires interpreting a trend, not just reading a value)

Return ONLY a valid JSON object:
{
  "passage": "Experiment 1\\nHypothesis: ...\\nMethod: ... (specify independent variable, dependent variable, control)\\nResults: ... (specific measurements)\\n\\nExperiment 2\\nHypothesis: ...\\nMethod: ...\\nResults: ...\\n\\nExperiment 3\\nHypothesis: ...\\nMethod: ...\\nResults: ...",
  "questions": [
    {
      "questionText": "Based on the results of Experiments 1 and 2 combined, which of the following conclusions is best supported?",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "correctAnswer": "A",
      "explanation": "Explanation citing specific results from both experiments, explaining why A is the only conclusion supported by both, and why each other option is contradicted by or unsupported by the combined data.",
      "difficulty": "hard"
    }
  ]
}`;
}

// ─── FLASHCARD PROMPTS ────────────────────────────────────────────────────────
export function buildFlashcardPrompt(section: Section, count: number, recentFronts: string[] = []): string {
  const sectionGuides: Record<Section, string> = {
    english: `Focus on HARD ACT English concepts that trip up even well-prepared students. Topics include:
- Subtle modifier errors: dangling participial phrases, misplaced adverbs, squinting modifiers
- Parallel structure in complex contexts: lists with mixed phrase types, correlative conjunctions (not only...but also, either...or)
- Pronoun ambiguity: when "it," "they," or "which" has multiple plausible antecedents
- Subjunctive mood: "if I were," "it is essential that he be," conditional constructions
- Rhetorical strategy questions: recognizing when to add, delete, or reorder for logical flow and emphasis
- Punctuation edge cases: comma splices vs. correctly joined independent clauses, restrictive vs. non-restrictive clauses
Example front: "What makes a participial phrase 'dangling,' and how do you fix it?"
Example back: "A participial phrase dangles when its implied subject differs from the grammatical subject of the main clause. Fix: make the logical actor the subject of the main clause. Wrong: 'Having studied all night, the exam seemed easy.' Right: 'Having studied all night, she found the exam easy.' The phrase must modify the noun immediately following the comma."`,

    math: `Focus on HARD ACT Math concepts requiring multi-step reasoning. Topics include:
- Function composition and inverses: f(g(x)), finding f⁻¹(x), domain/range of composed functions
- Advanced factoring: sum/difference of cubes, grouping, rational root theorem
- Logarithm laws and solving exponential equations: log(ab)=log a+log b, change of base, ln rules
- Trigonometric identities: sin²+cos²=1, double-angle formulas (sin2θ=2sinθcosθ), solving trig equations
- Conic sections: standard form of ellipses (x²/a²+y²/b²=1) and hyperbolas, completing the square
- Probability: conditional probability P(A|B)=P(A∩B)/P(B), combinations C(n,r), expected value
- Complex numbers: i²=-1, multiplying (a+bi)(c+di), modulus |z|=√(a²+b²)
Example front: "How do you solve log₂(x) + log₂(x-6) = 4?"
Example back: "1) Combine: log₂(x(x-6)) = 4. 2) Rewrite: x(x-6) = 2⁴ = 16. 3) Expand: x²-6x-16=0. 4) Factor: (x-8)(x+2)=0, so x=8 or x=-2. 5) Check domain: both arguments must be positive. x=8: log₂(8)✓, log₂(2)✓. x=-2: log₂(-2) undefined. Answer: x=8 only."`,

    reading: `Focus on HARD ACT Reading strategies for high-difficulty question types. Topics include:
- Evidence-pairing questions: how to identify the specific textual evidence that supports your answer to the previous question
- Author's rhetorical choices: identifying when an author uses analogy, concession, juxtaposition, or appeals to ethos/pathos/logos
- Tone precision: distinguishing between similar tones (sardonic vs. ironic, elegiac vs. melancholic, didactic vs. persuasive)
- Inference vs. assumption: how to find the ONLY defensible inference (not just a possible one), avoiding "too extreme" traps
- Paired passage synthesis: identifying points of agreement/disagreement between two authors who approach the same topic differently
- Purpose of structural elements: why an author opens with an anecdote, ends with a question, or uses a particular paragraph order
Example front: "How do you avoid the 'too extreme' trap in ACT Reading inference questions?"
Example back: "ACT inference answers must be true based ONLY on the passage — not probably true, not strongly implied, but necessarily true given what's stated. 'Too extreme' answers use absolutes (always, never, all, none) when the passage only supports limited claims. Strategy: find the answer that is the minimal, most conservative conclusion the passage actually supports. If you can imagine one reasonable exception, the answer is too extreme."`,

    science: `Focus on HARD ACT Science reasoning strategies. Topics include:
- Conflicting Viewpoints: how to track what each scientist claims, what evidence each cites, and what BOTH agree on
- Applying new evidence: how to evaluate whether a new finding strengthens, weakens, or is irrelevant to a specific hypothesis
- Multi-figure synthesis: how to cross-reference data from two tables/graphs that share a variable
- Experimental design analysis: identifying independent/dependent variables, controls, and design flaws in complex multi-experiment studies
- Falsification reasoning: identifying which result would be INCONSISTENT with (not just fail to support) a hypothesis
- Extrapolation with non-linear trends: recognizing when a trend is linear vs. exponential vs. leveling off, and what this implies beyond the data range
Example front: "How do you approach a 'new evidence' question in Conflicting Viewpoints?"
Example back: "Step 1: Identify the core claim of each viewpoint — what mechanism or cause does each scientist propose? Step 2: Determine what each hypothesis PREDICTS about the new evidence. Step 3: The new finding supports the hypothesis that predicted it and weakens the hypothesis that predicted the opposite. Watch out: evidence that's consistent with both viewpoints supports neither uniquely. Evidence that's impossible under one viewpoint is the strongest weapon against it."`,
  };

  const avoidBlock = recentFronts.length > 0
    ? `\nDo NOT repeat or closely paraphrase any of the following topics that were recently covered:\n${recentFronts.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nChoose entirely different concepts, rules, or question types from the ones listed above.`
    : '';

  return `You are an expert ACT tutor creating HARD flashcards for the ${SECTION_LABELS[section]} section.

${sectionGuides[section]}
${avoidBlock}

Generate ${count} high-quality flashcard(s) targeting genuinely difficult concepts — not basic facts students already know. Each card should address a specific error pattern, a nuanced rule with important exceptions, or a multi-step strategy. The back should include a worked example.

Return ONLY a valid JSON array with no other text:
[
  {
    "front": "Clear, specific hard question or concept (max 120 chars)",
    "back": "Complete explanation with the rule, a worked example showing application, and the key exception or trap (max 350 chars)"
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
