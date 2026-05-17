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

// Inline Vapi config sent to the client — no serverUrl, no secrets.
// Vapi creates a transient assistant per call when given a full config
// object rather than an assistant ID, so no dashboard assistant is needed.
export interface VapiClientConfig {
  firstMessage: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature: number;
    maxTokens: number;
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  transcriber: {
    provider: string;
    model: string;
    language: string;
  };
  silenceTimeoutSeconds: number;
  maxDurationSeconds: number;
  backgroundSound: string;
}

export function buildClientVapiConfig(params: {
  userName: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  duration: number;
  resumeText?: string;
}): VapiClientConfig {
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
- After approximately ${duration} minutes, say "Great session ${userName}, that wraps up our interview. Best of luck!" then stop talking.
- Keep your spoken responses concise — this is a voice interview, not a lecture.`;

  return {
    firstMessage: `Hi ${userName}! I'm ARIA, your AI interviewer today. We'll be doing a ${difficulty} ${role} interview for about ${duration} minutes. Feel free to think before answering — there's no rush. Ready to begin?`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }],
      temperature: 0.7,
      maxTokens: 300,
    },
    voice: {
      provider: '11labs',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Rachel — warm, professional
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: duration * 60 + 120,
    backgroundSound: 'off',
  };
}
