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

const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel — warm, professional 11labs voice

export function buildAssistantConfig(params: {
  userName: string;
  role: InterviewRole;
  difficulty: InterviewDifficulty;
  duration: number;
  resumeText?: string;
  serverUrl: string;
}) {
  const { userName, role, difficulty, duration, resumeText, serverUrl } = params;

  const resumeContext = resumeText
    ? `The candidate has provided their resume. Here are key highlights: ${resumeText.slice(0, 800)}.`
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
- After approximately ${duration} minutes, give brief feedback like "Great session, ${userName}. We're wrapping up." then call the endCall function.
- Keep responses concise — you're a voice interviewer, not a lecturer.`;

  return {
    name: `ARIA — ${role} Interview`,
    firstMessage: `Hi ${userName}! I'm ARIA, your AI interviewer today. We'll be doing a ${difficulty} ${role} interview for about ${duration} minutes. Feel free to take a moment before each answer — there's no rush. Ready to begin?`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      systemPrompt,
    },
    voice: {
      provider: '11labs',
      voiceId: VOICE_ID,
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    endCallFunctionEnabled: true,
    maxDurationSeconds: duration * 60 + 120,
    serverUrl,
    serverUrlSecret: env.VAPI_PRIVATE_KEY,
  };
}

export async function createVapiCall(assistantConfig: ReturnType<typeof buildAssistantConfig>) {
  const res = await fetch('https://api.vapi.ai/call', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.VAPI_PRIVATE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ assistant: assistantConfig }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Vapi API error: ${err}`);
  }

  return res.json() as Promise<{ id: string; [k: string]: unknown }>;
}
