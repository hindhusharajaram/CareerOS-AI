import api from '../api/axios';

export interface AICopilotExplanation {
  topic: string;
  explanationText: string;
  keyTakeaways: string[];
  immediateActionItems: string[];
  groundedContextSummary: string;
}

export interface AIResumeReview {
  professionalSummary: string;
  improvementSuggestions: string[];
  missingSections: string[];
  actionItems: string[];
  strongBulletPointSuggestions: string[];
  atsOptimizationAdvice: string[];
}

export interface StudyDay {
  day: string;
  topic: string;
  activity: string;
  durationMinutes: number;
}

export interface AILearningPlan {
  targetRole: string;
  technologySequence: string[];
  weeklyPlan: StudyDay[];
  recommendedResources: string[];
  difficultyProgression: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  questionText: string;
  expectedAnswerKeyPoints: string;
  followUpQuestions: string[];
}

export interface AIMockInterview {
  targetRole: string;
  difficultyLevel: string;
  questions: InterviewQuestion[];
  evaluationRubric: string[];
}

export interface AIProjectAdvice {
  projectId: string;
  projectTitle: string;
  architectureImprovements: string[];
  technologyUpgrades: string[];
  cloudImprovements: string[];
  securityImprovements: string[];
  databaseImprovements: string[];
  scalabilityImprovements: string[];
  deploymentImprovements: string[];
}

export interface AIChatMessage {
  id: string;
  sessionId: string;
  senderRole: string;
  messageText: string;
  createdAt: string;
}

export const aiService = {
  explainTopic: async (topic = 'CAREER_SCORE'): Promise<AICopilotExplanation> => {
    const res = await api.get('/api/v1/student/ai/copilot/explain', { params: { topic } });
    return res.data.data;
  },

  reviewResume: async (): Promise<AIResumeReview> => {
    const res = await api.post('/api/v1/student/ai/resume/review');
    return res.data.data;
  },

  generateLearningPlan: async (targetRole = 'Software Engineer'): Promise<AILearningPlan> => {
    try {
      const res = await api.post('/api/v1/student/ai/coaching/plan', null, { params: { targetRole } });
      if (res.data?.data && res.data.data.technologySequence?.length > 0) {
        return res.data.data;
      }
    } catch {
      // Fallback to dynamic client-side domain plan generator
    }
    return buildDynamicLearningPlan(targetRole);
  },

  generateMockInterview: async (targetRole = 'Software Engineer', difficulty = 'INTERMEDIATE'): Promise<AIMockInterview> => {
    const res = await api.post('/api/v1/student/ai/interview/generate', null, { params: { targetRole, difficulty } });
    return res.data.data;
  },

  analyzeProject: async (title = 'Full-Stack Web App', techStack = 'React, Java'): Promise<AIProjectAdvice> => {
    const res = await api.post('/api/v1/student/ai/project/analyze', null, { params: { title, techStack } });
    return res.data.data;
  },

  getChatMessages: async (): Promise<AIChatMessage[]> => {
    const res = await api.get('/api/v1/student/ai/chat/messages');
    return res.data.data;
  },

  sendChatMessage: async (messageText: string): Promise<AIChatMessage> => {
    const res = await api.post('/api/v1/ai/chat', { message: messageText });
    const replyText = res.data?.reply || 'No response received from AI.';
    return {
      id: `ai-${Date.now()}`,
      sessionId: 'session',
      senderRole: 'AI',
      messageText: replyText,
      createdAt: new Date().toISOString(),
    };
  },

  chatWithGpt: async (messageText: string): Promise<{ reply: string }> => {
    const res = await api.post('/api/v1/ai/chat', { message: messageText });
    return res.data;
  }
};

export function buildDynamicLearningPlan(query: string): AILearningPlan {
  const role = query.trim() || 'Software Engineer';
  const roleLower = role.toLowerCase();

  let techSeq: string[] = [];
  let weeklyPlan: StudyDay[] = [];
  let resources: string[] = [];
  let difficulty = 'Beginner → Intermediate → Advanced';

  if (roleLower.includes('data') || roleLower.includes('machine') || roleLower.includes('ai') || roleLower.includes('analytics')) {
    techSeq = ['Python 3.12', 'SQL & Pandas', 'Data Visualization (Seaborn)', 'Scikit-Learn', 'Deep Learning (PyTorch)', 'LLMs & RAG Pipelines'];
    weeklyPlan = [
      { day: 'Day 1: Foundations', topic: 'Python for Data Science', activity: 'Master NumPy vectorization and Pandas DataFrame manipulation on real datasets.', durationMinutes: 90 },
      { day: 'Day 2: Data Wrangling', topic: 'SQL & Exploratory Data Analysis', activity: 'Execute complex SQL joins, window functions, and missing data imputation.', durationMinutes: 120 },
      { day: 'Day 3: Supervised ML', topic: 'Scikit-Learn Classification', activity: 'Build & evaluate Random Forest and XGBoost classification models.', durationMinutes: 100 },
      { day: 'Day 4: Deep Learning', topic: 'PyTorch Neural Networks', activity: 'Train a Convolutional Neural Network (CNN) for image recognition.', durationMinutes: 120 },
      { day: 'Day 5: Generative AI', topic: 'RAG & Vector Embeddings', activity: 'Implement a LangChain RAG pipeline with ChromaDB vector store.', durationMinutes: 150 },
      { day: 'Day 6: Capstone Project', topic: 'End-to-End ML Pipeline', activity: 'Deploy a predictive model API using FastAPI and Docker.', durationMinutes: 180 },
    ];
    resources = [
      "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (O'Reilly)",
      'DeepLearning.AI: Generative AI with LLMs Certification',
      'Kaggle Competitions & Datasets Workspace',
      'FastAPI + PyTorch Production Deployment Guide'
    ];
  } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('infrastructure') || roleLower.includes('sre')) {
    techSeq = ['Linux System Admin', 'Git & Bash Scripting', 'Docker Containers', 'Kubernetes Orchestration', 'Terraform (IaC)', 'AWS & CI/CD Pipelines'];
    weeklyPlan = [
      { day: 'Day 1: OS Core', topic: 'Linux Systems & Shell Scripting', activity: 'Master bash automation scripts, systemd services, and file permissions.', durationMinutes: 90 },
      { day: 'Day 2: Containerization', topic: 'Docker & Multi-Stage Builds', activity: 'Containerize full-stack apps with multi-stage Dockerfiles and Compose.', durationMinutes: 120 },
      { day: 'Day 3: Orchestration', topic: 'Kubernetes Fundamentals', activity: 'Deploy Pods, Deployments, Services, and Ingress controllers on minikube.', durationMinutes: 120 },
      { day: 'Day 4: Infrastructure', topic: 'Terraform Infrastructure as Code', activity: 'Provision VPCs, EC2 instances, and RDS databases using HCL.', durationMinutes: 150 },
      { day: 'Day 5: Automation', topic: 'GitHub Actions & ArgoCD', activity: 'Build automated GitOps CI/CD deployment pipelines.', durationMinutes: 120 },
      { day: 'Day 6: Observability', topic: 'Prometheus & Grafana Monitoring', activity: 'Set up real-time cluster monitoring dashboards and alert triggers.', durationMinutes: 150 },
    ];
    resources = [
      'The DevOps Handbook: World-Class Agility & Security',
      'Kubernetes Certified Application Developer (CKAD) Prep',
      'HashiCorp Terraform Associate Guide',
      'AWS Certified Solutions Architect Official Docs'
    ];
  } else if (roleLower.includes('front') || roleLower.includes('react') || roleLower.includes('ui') || roleLower.includes('web')) {
    techSeq = ['HTML5 & Modern CSS', 'TypeScript 5', 'React 18 & Hooks', 'TailwindCSS & Design Tokens', 'Next.js 14 App Router', 'Web Performance & Testing'];
    weeklyPlan = [
      { day: 'Day 1: Modern JS/TS', topic: 'TypeScript Advanced Types', activity: 'Master Generics, Utility Types, and strict type safety patterns.', durationMinutes: 90 },
      { day: 'Day 2: React Core', topic: 'Custom Hooks & State Machines', activity: 'Build complex custom hooks for data fetching, caching, and form validation.', durationMinutes: 120 },
      { day: 'Day 3: Architecture', topic: 'Design Systems & TailwindCSS', activity: 'Construct an accessible, responsive design system component library.', durationMinutes: 100 },
      { day: 'Day 4: Server Components', topic: 'Next.js App Router & SSR', activity: 'Build server-rendered pages with dynamic routing and server actions.', durationMinutes: 120 },
      { day: 'Day 5: Performance', topic: 'Lighthouse & Bundle Optimization', activity: 'Optimize Web Vitals, dynamic imports, and lazy loading strategies.', durationMinutes: 90 },
      { day: 'Day 6: Capstone Project', topic: 'Production Web Application', activity: 'Deploy a high-performance React dashboard to Vercel/Netlify.', durationMinutes: 180 },
    ];
    resources = [
      'React Official Documentation (react.dev)',
      'TypeScript Deep Dive by Basarat Ali Syed',
      'Refactoring UI by Adam Wathan & Steve Schoger',
      'Web Vitals & Performance Optimization Guide (web.dev)'
    ];
  } else if (roleLower.includes('mobile') || roleLower.includes('ios') || roleLower.includes('android') || roleLower.includes('flutter')) {
    techSeq = ['Kotlin / Swift / Dart', 'React Native / Flutter', 'State Management (Riverpod/Zustand)', 'REST & GraphQL APIs', 'SQLite / Realm Storage', 'CI/CD & App Store Release'];
    weeklyPlan = [
      { day: 'Day 1: Language Core', topic: 'Mobile Language Fundamentals', activity: 'Master object-oriented and functional paradigms for mobile development.', durationMinutes: 90 },
      { day: 'Day 2: UI Layouts', topic: 'Responsive Native UI Design', activity: 'Build cross-platform component layouts with smooth animations.', durationMinutes: 120 },
      { day: 'Day 3: State & Data', topic: 'Global State Management', activity: 'Implement predictable state architectures for complex app workflows.', durationMinutes: 120 },
      { day: 'Day 4: Networking', topic: 'API Integration & Offline First', activity: 'Connect mobile apps to REST APIs with local SQLite caching.', durationMinutes: 120 },
      { day: 'Day 5: Native Features', topic: 'Camera, Location & Push Notifications', activity: 'Integrate hardware sensors and Firebase Cloud Messaging.', durationMinutes: 150 },
      { day: 'Day 6: Deployment', topic: 'App Store & TestFlight Pipeline', activity: 'Configure Fastlane automated builds for iOS App Store and Google Play.', durationMinutes: 150 },
    ];
    resources = [
      'Android Developers Official Guides (developer.android.com)',
      'Apple Developer Documentation (developer.apple.com)',
      'Flutter & Dart Complete Masterclass Guide',
      'React Native Official Architecture Documentation'
    ];
  } else if (roleLower.includes('security') || roleLower.includes('cyber') || roleLower.includes('penetration')) {
    techSeq = ['Networking Protocols (TCP/IP)', 'Linux Security & Hardening', 'Penetration Testing (Burp Suite)', 'Cryptography & PKI', 'SOC Analysis & SIEM', 'Cloud Security Posture'];
    weeklyPlan = [
      { day: 'Day 1: Network Core', topic: 'Packet Analysis & Wireshark', activity: 'Capture and analyze network traffic protocols, handshakes, and headers.', durationMinutes: 90 },
      { day: 'Day 2: Web Security', topic: 'OWASP Top 10 Vulnerabilities', activity: 'Perform SQL injection, XSS, and CSRF security audits in lab environments.', durationMinutes: 120 },
      { day: 'Day 3: Linux Hardening', topic: 'System Auditing & Firewall Rules', activity: 'Configure iptables, fail2ban, SSH key policies, and SELinux.', durationMinutes: 120 },
      { day: 'Day 4: Offensive Security', topic: 'Burp Suite & Metasploit', activity: 'Execute vulnerability scans and privilege escalation vectors.', durationMinutes: 150 },
      { day: 'Day 5: Incident Response', topic: 'SIEM & Threat Hunting', activity: 'Configure Splunk/ELK log monitoring for security intrusion detection.', durationMinutes: 120 },
      { day: 'Day 6: Certification Prep', topic: 'CompTIA Security+ / CEH Labs', activity: 'Solve hands-on Capture The Flag (CTF) security challenges.', durationMinutes: 180 },
    ];
    resources = [
      'OWASP Top 10 Web Application Security Risks',
      'TryHackMe & Hack The Box Hands-On Labs',
      'Practical Malware Analysis by Michael Sikorski',
      'NIST Cybersecurity Framework Official Guidelines'
    ];
  } else {
    techSeq = [
      `${role} Foundations`,
      'Core Programming & Algorithms',
      'Database Architecture & SQL',
      'API Design & Microservices',
      'Cloud Deployment & Containers',
      'Production System Design'
    ];
    weeklyPlan = [
      { day: 'Day 1: Core Fundamentals', topic: `${role} Language & Paradigms`, activity: `Master essential concepts, syntax, and design patterns required for ${role}.`, durationMinutes: 90 },
      { day: 'Day 2: Data Persistence', topic: 'Relational & NoSQL Storage', activity: 'Design normalized schemas, index execution plans, and data access layers.', durationMinutes: 120 },
      { day: 'Day 3: API Architecture', topic: 'RESTful & Service Layer Design', activity: 'Implement secure endpoints, DTO mappings, and input validation filters.', durationMinutes: 120 },
      { day: 'Day 4: System Reliability', topic: 'Caching, Queues & Async Tasks', activity: 'Integrate Redis caching and async message queues to optimize throughput.', durationMinutes: 120 },
      { day: 'Day 5: Infrastructure', topic: 'Docker Containerization & CI/CD', activity: 'Containerize the application and set up automated build & deployment pipelines.', durationMinutes: 120 },
      { day: 'Day 6: Capstone Project', topic: `${role} Portfolio Application`, activity: 'Build and deploy a full-featured engineering project to GitHub.', durationMinutes: 180 },
    ];
    resources = [
      `Designing Data-Intensive Applications for ${role}`,
      `Official Documentation & Best Practices Guide for ${role}`,
      'System Design Primer & Scalability Architecture Workbook',
      'GitHub Portfolio Templates & Production Code Examples'
    ];
  }

  return {
    targetRole: role,
    technologySequence: techSeq,
    weeklyPlan,
    recommendedResources: resources,
    difficultyProgression: difficulty,
  };
}

