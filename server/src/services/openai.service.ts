import OpenAI from 'openai';
import { env } from '../config/env';

const client = new OpenAI({
  apiKey: env.OPENROUTER_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://aria-interview.app',
    'X-Title': 'ARIA Interview Platform',
  },
});

interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
}

interface FeedbackResult {
  scores: {
    technical: number;
    communication: number;
    confidence: number;
    problemSolving: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export async function generateFeedback(
  transcript: TranscriptEntry[],
  role: string,
  difficulty: string
): Promise<FeedbackResult> {
  const transcriptText = transcript
    .map((t) => `${t.role === 'user' ? 'Candidate' : 'Interviewer'}: ${t.text}`)
    .join('\n');

  const prompt = `You are an expert technical interview evaluator. Analyze the following ${difficulty} ${role} interview transcript and provide structured feedback.

TRANSCRIPT:
${transcriptText}

Respond ONLY with a valid JSON object matching this exact schema:
{
  "scores": {
    "technical": <0-100 integer>,
    "communication": <0-100 integer>,
    "confidence": <0-100 integer>,
    "problemSolving": <0-100 integer>,
    "overall": <0-100 integer>
  },
  "strengths": ["<specific strength>", ...],
  "weaknesses": ["<specific weakness>", ...],
  "suggestions": ["<actionable suggestion>", ...],
  "summary": "<2-3 sentence honest overall assessment>"
}

Scoring guide:
- technical: accuracy and depth of technical knowledge
- communication: clarity, structure, ability to explain concepts
- confidence: assertiveness, handling uncertainty gracefully
- problemSolving: approach, breaking down problems, asking clarifying questions
- overall: weighted average considering all dimensions

Be specific and actionable. Minimum 3 items in each array.`;

  const response = await client.chat.completions.create({
    model: 'openai/gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from AI');

  const parsed = JSON.parse(content) as FeedbackResult;
  return parsed;
}
