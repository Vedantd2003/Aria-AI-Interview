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

export interface VapiClientConfig {
  firstMessage: string;
  model: {
    provider: string;
    model: string;
    messages: Array<{ role: string; content: string }>;
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
  maxDurationSeconds: number;
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

Conduct a ${difficulty} difficulty ${role} interview lasting approximately ${duration} minutes.

Guidelines:
- Ask one question at a time. Wait for the full answer before responding.
- Ask 1-2 focused follow-ups per question to probe depth.
- Cover: ${ROLE_TOPICS[role]}.
- Be professional and encouraging but rigorous.
- Vary question types: conceptual, practical, scenario-based.
- Do NOT give away answers. Offer a small hint only if the candidate is stuck.
- After ${duration} minutes, say "That wraps up our session, ${userName}. Best of luck!" then end the call.
- Keep spoken responses concise — this is a voice interview.`;

  return {
    firstMessage: `Hi ${userName}! I'm ARIA, your AI interviewer. We're doing a ${difficulty} ${role} interview for about ${duration} minutes. Take your time with each answer — ready to begin?`,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }],
    },
    // OpenAI TTS: no separate ElevenLabs account needed in Vapi
    voice: {
      provider: 'openai',
      voiceId: 'shimmer', // warm, professional female voice
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    maxDurationSeconds: duration * 60 + 120,
  };
}
