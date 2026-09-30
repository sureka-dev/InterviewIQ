import { Question } from '../types';

export const INTERVIEW_QUESTIONS: Question[] = [
  // HR Questions
  {
    id: 'hr-1',
    category: 'hr',
    categoryName: 'Human Resources',
    roleLevel: 'Mid',
    prompt: 'Tell me about yourself and what led you to apply for this position.',
    context: 'The classic opening question. Evaluates clarity, career narrative coherence, and genuine motivation.',
    expectedKeywords: [
      'experience', 'background', 'passion', 'growth', 'contribution', 
      'skills', 'team', 'values', 'achieve', 'impact', 'learning'
    ],
    tips: [
      'Follow the Present-Past-Future framework: where you are now, relevant past achievements, and why this role is your logical next step.',
      'Keep it between 120 and 220 words; avoid reciting your entire resume.',
      'Connect your personal passion directly to company mission or product.'
    ],
    sampleIdealAnswer: 'Over the past four years, I have worked as a product engineer building high-throughput user applications. In my current role, I led the redesign of our core customer dashboard, which reduced bounce rates by 28% and improved onboarding speed. What excites me most about this opportunity is your team’s dedication to thoughtful engineering and scalable architecture. I want to bring my background in frontend performance and cross-functional leadership to help scale your next generation of user workflows.'
  },
  {
    id: 'hr-2',
    category: 'hr',
    categoryName: 'Human Resources',
    roleLevel: 'Mid',
    prompt: 'How do you handle disagreements or conflicting priorities with cross-functional teammates?',
    context: 'Assesses interpersonal maturity, active listening, conflict resolution, and commitment to organizational goals.',
    expectedKeywords: [
      'listen', 'perspective', 'alignment', 'collaboration', 'empathy', 
      'data', 'compromise', 'objective', 'communication', 'respect'
    ],
    tips: [
      'Demonstrate empathy and intellectual humility—seek first to understand their viewpoint.',
      'Show that decisions should be grounded in customer value and shared metrics, not ego.',
      'Mention a specific resolution technique like alignment workshops or data-driven testing.'
    ],
    sampleIdealAnswer: 'When conflicting priorities arise, my first instinct is to schedule a quick 1-on-1 to listen actively to the other person’s constraints and goals. For instance, when engineering and design had differing timelines on a feature rollout, I organized a joint prioritization matrix mapping customer impact against implementation complexity. By anchoring the conversation in objective user data rather than personal opinions, we reached a phased rollout plan that satisfied UX standards without delaying our quarterly milestones.'
  },
  {
    id: 'hr-3',
    category: 'hr',
    categoryName: 'Human Resources',
    roleLevel: 'Senior',
    prompt: 'Where do you see your career heading in the next 3 to 5 years, and how does this role align with that vision?',
    context: 'Evaluates ambition, realism, retention likelihood, and alignment with company trajectory.',
    expectedKeywords: [
      'leadership', 'mentorship', 'architecture', 'mastery', 'initiative', 
      'scale', 'long-term', 'responsibility', 'strategic', 'milestone'
    ],
    tips: [
      'Balance personal growth with business contributions.',
      'Highlight desire for deeper technical domain mastery or team mentorship.',
      'Show that you are looking for a long-term investment, not a short stepping stone.'
    ],
    sampleIdealAnswer: 'Over the next three to five years, I aim to deepen my expertise in scalable system design while stepping into greater technical leadership and mentorship responsibilities. I want to be someone who not only executes mission-critical projects with high reliability but also empowers junior teammates to level up. This role offers the ideal blend of high-impact technical challenges and an autonomous culture where I can contribute to core architectural decisions and cultivate a collaborative engineering environment.'
  },

  // Technical Questions
  {
    id: 'tech-1',
    category: 'technical',
    categoryName: 'Technical & Engineering',
    roleLevel: 'Mid',
    prompt: 'How do you approach debugging a high-latency issue or critical bug in a production environment?',
    context: 'Evaluates root-cause analysis, production triage discipline, monitoring tooling, and systematic problem solving.',
    expectedKeywords: [
      'reproduce', 'telemetry', 'logs', 'metrics', 'isolation', 
      'root cause', 'rollback', 'hypothesis', 'mitigate', 'post-mortem', 'monitoring'
    ],
    tips: [
      'First emphasize triage and mitigation (e.g. rolling back or circuit breaking) before deep investigation.',
      'Detail systematic hypothesis testing: inspecting logs, distributed tracing, and APM metrics.',
      'Mention blameless post-mortems and preventative regression tests.'
    ],
    sampleIdealAnswer: 'When production latency spikes, my immediate priority is containment to protect the user experience—whether that means flipping a feature flag, rerouting traffic, or rolling back the latest deployment. Once stabilized, I examine our APM metrics and distributed traces to isolate the bottleneck, distinguishing between database query contention, network saturation, or memory leaks. After replicating the condition in a staging environment and identifying the root cause, I deploy a verified patch accompanied by automated regression tests and write a blameless post-mortem with action items to prevent recurrence.'
  },
  {
    id: 'tech-2',
    category: 'technical',
    categoryName: 'Technical & Engineering',
    roleLevel: 'Senior',
    prompt: 'Explain how you design a system or service for scalability, resilience, and maintainability.',
    context: 'Tests architectural breadth, trade-off evaluation, decoupling strategies, and operational mindset.',
    expectedKeywords: [
      'decoupling', 'caching', 'stateless', 'asynchronous', 'scalability', 
      'redundancy', 'database', 'bottlenecks', 'microservices', 'load balancing', 'failover'
    ],
    tips: [
      'Articulate key architectural principles: loose coupling, horizontal scaling, and stateless services.',
      'Address failure modes: retry policies with exponential backoff, circuit breakers, and rate limiting.',
      'Highlight maintainability: clear domain boundaries, API contracts, and observability.'
    ],
    sampleIdealAnswer: 'Designing for scale begins with clear domain decoupling and stateless application tiers that scale horizontally behind managed load balancers. For data persistence, I separate read and write paths using caching strategies like Redis and read replicas to prevent database bottlenecks. Resilience is baked in via asynchronous event messaging for non-blocking operations, circuit breakers to prevent cascading outages, and automated health checks. Finally, maintainability relies on strict API contracts, automated integration suites, and structured distributed logging.'
  },
  {
    id: 'tech-3',
    category: 'technical',
    categoryName: 'Technical & Engineering',
    roleLevel: 'Mid',
    prompt: 'Describe a technical trade-off you had to make recently. What were the alternatives, and why did you choose that path?',
    context: 'Tests pragmatic engineering judgment, business context awareness, and ability to justify technical choices.',
    expectedKeywords: [
      'trade-off', 'latency', 'complexity', 'simplicity', 'alternative', 
      'performance', 'velocity', 'constraints', 'decision', 'outcome'
    ],
    tips: [
      'Frame the decision around concrete constraints (time to market vs. perfection, memory vs. compute).',
      'Explain why the rejected alternative seemed attractive initially.',
      'Summarize the actual outcome and whether subsequent metrics proved the choice right.'
    ],
    sampleIdealAnswer: 'In our recent notification service refactor, we faced a choice between implementing a full Kafka cluster or utilizing our existing Redis queue with background workers. While Kafka offered superior distributed event replay, our projected event volume for the next year was well within Redis capacity, and deploying Kafka would have added significant operational complexity and delayed the release by six weeks. We decided on the Redis-backed queue with a clean abstraction layer. This allowed us to launch on time with zero operational incidents while keeping our infrastructure lean.'
  },

  // Behavioral Questions
  {
    id: 'beh-1',
    category: 'behavioral',
    categoryName: 'Behavioral & Leadership',
    roleLevel: 'Mid',
    prompt: 'Describe a situation where a project was falling behind schedule. How did you react and what was the outcome?',
    context: 'Tests problem ownership, prioritization, communication under stress, and delivery commitment.',
    starPrompt: {
      situation: 'What was the project, the deadline, and why was it falling behind?',
      task: 'What was your specific responsibility in getting it back on track?',
      action: 'What concrete steps did you take (e.g. scope pruning, reallocation)?',
      result: 'What was the quantifiable outcome and what did the team learn?'
    },
    expectedKeywords: [
      'situation', 'deadline', 'prioritize', 'scope', 'stakeholders', 
      'transparent', 'action', 'delivered', 'result', 'timeline'
    ],
    tips: [
      'Strictly use the STAR method: Situation, Task, Action, Result.',
      'Show proactive transparency with stakeholders early rather than surprising them at the end.',
      'Focus on decisive prioritization and protecting the core user value.'
    ],
    sampleIdealAnswer: 'Two weeks before launching a new client billing portal, an unexpected integration bug in our third-party payment webhook pushed our delivery timeline into jeopardy. As technical lead, I knew postponing would impact quarterly revenue. I called an emergency sync, unblocked the team by pruning two non-essential cosmetic features into Phase Two, and spearheaded pair programming sessions to resolve the webhook retry logic. Because of this swift refocus, we shipped the core payment portal on the target launch date with 100% transaction integrity, processing $340,000 in the first week without failure.'
  },
  {
    id: 'beh-2',
    category: 'behavioral',
    categoryName: 'Behavioral & Leadership',
    roleLevel: 'Mid',
    prompt: 'Tell me about a time you received difficult constructive criticism. How did you process it and what changes did you make?',
    context: 'Tests growth mindset, receptiveness to feedback, emotional intelligence, and self-improvement.',
    starPrompt: {
      situation: 'What was the context or review where the feedback was delivered?',
      task: 'What did you realize you needed to improve?',
      action: 'What actions, habits, or systems did you put in place?',
      result: 'How did your performance improve and what was subsequent feedback?'
    },
    expectedKeywords: [
      'feedback', 'constructive', 'listen', 'reflect', 'improvement', 
      'action', 'growth', 'perspective', 'communication', 'progress'
    ],
    tips: [
      'Do not get defensive in your answer; show genuine gratitude for the feedback.',
      'Highlight specific behavioral adjustments you implemented.',
      'Show positive long-term outcome and validation from peers.'
    ],
    sampleIdealAnswer: 'During an annual performance review, my manager shared that while my technical execution was exceptional, my written project updates were too dense and technical for non-engineering stakeholders, causing misaligned expectations. Instead of feeling defensive, I asked for specific examples and recognized the gap. I established a practice of summarizing engineering milestones in three crisp business-oriented bullets before going into technical specifics, and I ran my drafted updates by a product peer for feedback. Within two months, our VP of Operations praised the clarity of our sprint reports, noting it made cross-departmental coordination significantly smoother.'
  },

  // General Questions
  {
    id: 'gen-1',
    category: 'general',
    categoryName: 'General & Core Strengths',
    roleLevel: 'Entry',
    prompt: 'What do you consider your greatest professional strength, and can you share an example of it in action?',
    context: 'Evaluates self-awareness, authentic confidence, and ability to substantiate claims with tangible evidence.',
    expectedKeywords: [
      'strength', 'problem-solving', 'adaptability', 'initiative', 'ownership', 
      'execution', 'results', 'example', 'collaborate', 'impact'
    ],
    tips: [
      'Pick a strength directly relevant to the role (e.g. structured problem-solving, rapid execution, or technical synthesis).',
      'Ground the strength in a clear mini-story with measurable outcome.',
      'Avoid cliches like "perfectionist" or "workaholic".'
    ],
    sampleIdealAnswer: 'My greatest professional strength is structured problem-solving under ambiguous constraints. When faced with an undefined problem, I break it down into testable first-principles components and drive rapid iterative validation. For example, when our customer support team was overwhelmed with repetitive onboarding tickets, I independently mapped out the user drop-off points, identified two recurring configuration stumbling blocks, and developed interactive in-app guides that reduced support tickets by 42% in the first month.'
  },
  {
    id: 'gen-2',
    category: 'general',
    categoryName: 'General & Core Strengths',
    roleLevel: 'Mid',
    prompt: 'Why should we hire you over other qualified candidates applying for this role?',
    context: 'Assesses competitive differentiation, value proposition, culture alignment, and confidence without arrogance.',
    expectedKeywords: [
      'unique', 'value', 'deliver', 'passion', 'culture', 
      'track record', 'execution', 'velocity', 'commitment', 'alignment'
    ],
    tips: [
      'Synthesize your unique intersection: technical competence + business curiosity + dependable execution.',
      'Express genuine enthusiasm for the specific company problems, not just generic tasks.',
      'Keep your tone grounded, assertive, and focused on value creation for the team.'
    ],
    sampleIdealAnswer: 'What sets me apart is my ability to bridge high-rigor engineering execution with a deep intuition for business value and customer experience. I don’t just write clean, scalable code; I actively measure how our technical decisions move core business metrics. With a proven track record of shipping production-grade applications on tight schedules and a collaborative mindset that elevates the people around me, I can hit the ground running immediately and help your team achieve its upcoming growth objectives.'
  }
];

export const CATEGORY_METADATA = {
  hr: {
    id: 'hr',
    name: 'HR & Culture',
    tagline: 'Culture, background, conflict resolution, and career trajectory',
    description: 'Master interpersonal dynamics, leadership philosophies, motivation, and career storytelling.',
    icon: 'Users',
    accentColor: '#E65A3C',
    questionCount: 3,
    avgTime: '10–12 min',
    topics: ['Career narrative', 'Conflict resolution', 'Team alignment', 'Long-term vision']
  },
  technical: {
    id: 'technical',
    name: 'Technical & Engineering',
    tagline: 'System architecture, production triage, debugging, and trade-offs',
    description: 'Demonstrate algorithmic clarity, architectural discipline, scalability reasoning, and operational judgment.',
    icon: 'Cpu',
    accentColor: '#1B4332',
    questionCount: 3,
    avgTime: '12–15 min',
    topics: ['Production debugging', 'System scalability', 'Technical trade-offs', 'Resilience patterns']
  },
  behavioral: {
    id: 'behavioral',
    name: 'Behavioral & Leadership',
    tagline: 'STAR method, situational judgment, ownership, and resilience',
    description: 'Structure vivid answers demonstrating ownership, adaptability, feedback receptiveness, and delivery.',
    icon: 'Compass',
    accentColor: '#B45309',
    questionCount: 2,
    avgTime: '8–10 min',
    topics: ['STAR framework', 'Crisis handling', 'Constructive feedback', 'Cross-functional leadership']
  },
  general: {
    id: 'general',
    name: 'General & Core Strengths',
    tagline: 'Value proposition, strengths, differentiation, and pitch',
    description: 'Polish your competitive advantage, value pitch, problem-solving mindset, and personal brand.',
    icon: 'Award',
    accentColor: '#3F3F46',
    questionCount: 2,
    avgTime: '6–8 min',
    topics: ['Unique value proposition', 'Problem solving', 'Differentiating strengths', 'Role alignment']
  }
};
