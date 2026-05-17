import { env } from '../config/env';
import { InterviewDifficulty, InterviewRole } from '../models/Interview';

const ROLE_TOPICS: Record<InterviewRole, string> = {
  Frontend:
    'HTML/CSS, JavaScript, React/Vue/Angular, browser APIs, performance, accessibility, state management, bundlers',
  Backend:
    'REST/GraphQL API design, databases (SQL + NoSQL), caching, auth, message queues, microservices, security',
  'Full-Stack':
    'Frontend + backend fundamentals, system design basics, deployment, databases, API design',
  'System Design':
    'scalability, load balancing, caching strategies, database sharding, CAP theorem, distributed systems, real-world architecture',
  Behavioral:
    'STAR method, leadership, conflict resolution, teamwork, growth mindset, failure/success stories',
  DSA: 'arrays, strings, trees, graphs, dynamic programming, sorting, searching, time/space complexity analysis',
};

export interface AssistantOverrides {
  firstMessage: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{ role: string; content: string }>;
  };
  maxDurationSeconds: number;
}

export function buildAssistantOverrides(params: {
  userName: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  duration: number;
  resumeText?: string;
}): AssistantOverrides {
  const { userName, role, difficulty, duration, resumeText } = params;

  const resumeContext = resumeText
    ? `The candidate has provided their resume. Key highlights: ${resumeText.slice(0, 600)}.`
    : 'The candidate has not provided a resume.';

  const systemPrompt = `You are ARIA, a senior ${role} interviewer at a top tech company. You are interviewing ${userName}. ${resumeContext}

Conduct a ${difficulty} difficulty ${role} interview. The interview should last approximately ${duration} minutes.

Guidelines:
- Ask one question at a time. Listen fully before responding.
- Ask 1-2 focused follow-ups per question to probe depth and understanding.
- Cover: ${ROLE_TOPICS[role]}.
- Be professional, encouraging but rigorous. Praise good answers briefly; probe gaps without being harsh.
- Vary question types: conceptual, practical, scenario-based.
- Do NOT give away answers. If the candidate is stuck, offer a small hint.
- After approximately ${duration} minutes, give brief feedback like "Great session, ${userName}. We're wrapping up." then end the call.
- Keep responses concise — you're a voice interviewer, not a lecturer.`;

  return {
    firstMessage: `Hi ${userName}! I'm ARIA, your AI interviewer today. We'll be doing a ${difficulty} ${role} interview for about ${duration} minutes. Feel free to take a moment before each answer. Ready to begin?`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }],
    },
    maxDurationSeconds: duration * 60 + 120,
  };
}
