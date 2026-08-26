package com.careerosai.ai.provider;

import com.careerosai.ai.dto.AICopilotExplanationDto;
import com.careerosai.ai.dto.AILearningPlanDto;
import com.careerosai.ai.dto.AIMockInterviewDto;
import com.careerosai.ai.dto.AIProjectAdviceDto;
import com.careerosai.ai.dto.AIResumeReviewDto;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Component("mockAIProvider")
public class MockAIProviderImpl implements AIProvider {

    @Override
    public String getProviderName() {
        return "Local Grounded Mock AI Provider (Deterministic Engine Driven)";
    }

    @Override
    public AICopilotExplanationDto explainTopic(final String topic, final String prompt, final String contextJson) {
        final String formattedTopic = topic != null ? topic.toUpperCase() : "CAREER_SCORE";

        final List<String> takeaways = new ArrayList<>();
        final List<String> actions = new ArrayList<>();
        String expText = "";

        switch (formattedTopic) {
            case "CAREER_SCORE":
                expText = "Your Career Score is computed using 9 weighted indicators. Projects (20%) and Technical Skills (20%) carry the highest impact on top tech placement shortlist rates.";
                takeaways.add("Projects and Skills account for 40% of total score weight.");
                takeaways.add("Completing bio and contact information adds immediate profile completeness points.");
                actions.add("Build at least 2 full-stack or AI projects with public GitHub repos.");
                actions.add("Add 3 missing core skills to your skill matrix.");
                break;
            case "ATS_SCORE":
                expText = "Your ATS Resume Score measures keyword density and standard section headers. Applicant tracking systems automatically scan for Contact Info, Skills, Education, and Experience.";
                takeaways.add("Clean section headers ensure 100% parsing accuracy.");
                actions.add("Ensure email, phone, and LinkedIn URL are clearly visible near top of resume.");
                actions.add("List technical skills using standard industry taxonomy terms.");
                break;
            case "SKILL_GAP":
                expText = "Your Skill Gap analysis compares verified candidate competencies against target role requirements. Closing HIGH priority gaps significantly boosts interview shortlist probability.";
                takeaways.add("Target role demands Java, Spring Boot, React, and System Design.");
                actions.add("Dedicate ~30 hours to master Spring Boot REST API patterns.");
                actions.add("Practice SQL database join queries and PostgreSQL optimization.");
                break;
            case "ELIGIBILITY":
                expText = "Eligibility evaluations deterministically check academic CGPA, graduation year, verified skills, and project counts against corporate hiring criteria.";
                takeaways.add("Tier-1 programs (Google STEP, Microsoft Explore) prioritize CGPA >= 7.5 and CS majors.");
                actions.add("Maintain academic CGPA above target threshold.");
                actions.add("Add at least 1 verified full-stack project.");
                break;
            default:
                expText = "CareerOS AI Copilot analyzes your candidate profile against active placement metrics to provide explainable decision support.";
                takeaways.add("Grounding logic in structured profile context eliminates recommendations hallucination.");
                actions.add("Follow week-by-week action milestones on your 90-Day Roadmap.");
                break;
        }

        return AICopilotExplanationDto.builder()
            .topic(formattedTopic)
            .explanationText(expText)
            .keyTakeaways(takeaways)
            .immediateActionItems(actions)
            .groundedContextSummary("Grounded in candidate profile, skills matrix, and target placement criteria.")
            .build();
    }

    @Override
    public AIResumeReviewDto reviewResume(final String resumeText, final String contextJson) {
        return AIResumeReviewDto.builder()
            .professionalSummary("Driven Computer Science candidate specializing in full-stack web applications, REST API design, and cloud database architecture.")
            .improvementSuggestions(Arrays.asList(
                "Quantify achievements in project descriptions (e.g. 'Reduced latency by 35%').",
                "Ensure public GitHub and LinkedIn links are hyperlinked at the top.",
                "Include a distinct 'Technical Skills' section categorized by Backend, Frontend, and Tools."
            ))
            .missingSections(Arrays.asList("Certifications", "Open Source Contributions"))
            .actionItems(Arrays.asList(
                "Add active metrics to project bullet points.",
                "Upload updated PDF resume to version history."
            ))
            .strongBulletPointSuggestions(Arrays.asList(
                "Architected scalable Java Spring Boot REST API serving 1,000+ daily requests with PostgreSQL backend.",
                "Implemented modern responsive UI using React 18, TypeScript, and Tailwind CSS."
            ))
            .atsOptimizationAdvice(Arrays.asList(
                "Use standard section headers: Education, Technical Skills, Experience, Projects.",
                "Avoid complex graphics or multi-column layouts that hinder ATS parsing."
            ))
            .build();
    }

    @Override
    public AILearningPlanDto generateLearningPlan(final String targetRole, final String contextJson) {
        final String role = (targetRole != null && !targetRole.isBlank()) ? targetRole : "Software Engineer";
        final String roleLower = role.toLowerCase();

        final List<AILearningPlanDto.StudyDay> days = new ArrayList<>();
        List<String> techSeq;
        List<String> resources;
        String difficulty = "Beginner -> Intermediate -> Advanced";

        if (roleLower.contains("data") || roleLower.contains("machine") || roleLower.contains("ai") || roleLower.contains("analytics")) {
            techSeq = Arrays.asList("Python 3.12", "Pandas & SQL", "Scikit-Learn", "PyTorch / TensorFlow", "FastAPI & RAG Pipelines");
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 1: Data Foundations").topic("Python for Data Science").activity("Master NumPy vectorization and Pandas DataFrame manipulation").durationMinutes(90).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 2: Exploratory Analysis").topic("SQL & Data Wrangling").activity("Execute complex SQL joins, window functions, and data cleaning").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 3: Supervised ML").topic("Scikit-Learn Modeling").activity("Train and evaluate Random Forest and XGBoost classifiers").durationMinutes(100).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 4: Deep Learning").topic("PyTorch Neural Networks").activity("Train CNN/Transformer models for image/text classification").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 5: Generative AI").topic("LLM RAG Pipelines").activity("Build a LangChain RAG pipeline with ChromaDB vector store").durationMinutes(150).build());
            resources = Arrays.asList("Hands-On Machine Learning (O'Reilly)", "DeepLearning.AI: Generative AI Certification", "Kaggle Competitions & Datasets Workspace");
        } else if (roleLower.contains("devops") || roleLower.contains("cloud") || roleLower.contains("infrastructure")) {
            techSeq = Arrays.asList("Linux Systems", "Docker Containers", "Kubernetes", "Terraform (IaC)", "AWS & CI/CD Pipelines");
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 1: OS Core").topic("Linux & Shell Scripting").activity("Master bash scripts, systemd services, and network permissions").durationMinutes(90).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 2: Containerization").topic("Docker Multi-Stage Builds").activity("Containerize full-stack apps with multi-stage Dockerfiles").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 3: Orchestration").topic("Kubernetes Cluster Mgmt").activity("Deploy Pods, Services, and Ingress controllers on minikube").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 4: Infrastructure").topic("Terraform IaC").activity("Provision cloud VPCs, EC2 instances, and RDS databases using HCL").durationMinutes(150).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 5: Automation").topic("GitHub Actions GitOps").activity("Construct automated CI/CD deployment pipelines").durationMinutes(120).build());
            resources = Arrays.asList("The DevOps Handbook", "Certified Kubernetes Application Developer (CKAD) Prep", "HashiCorp Terraform Associate Guide");
        } else if (roleLower.contains("front") || roleLower.contains("react") || roleLower.contains("ui")) {
            techSeq = Arrays.asList("TypeScript 5", "React 18 & Hooks", "TailwindCSS", "Next.js App Router", "Performance & Web Vitals");
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 1: Modern JS/TS").topic("TypeScript Advanced Types").activity("Master Generics, Utility Types, and strict type safety").durationMinutes(90).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 2: React Core").topic("Custom Hooks & State").activity("Build custom data-fetching and caching React hooks").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 3: UI System").topic("Design Systems & Tailwind").activity("Construct an accessible responsive design system component library").durationMinutes(100).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 4: SSR & Next.js").topic("Next.js Server Components").activity("Build server-rendered pages with dynamic routing and server actions").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 5: Optimization").topic("Web Vitals & Bundling").activity("Optimize LCP, CLS, dynamic imports, and lazy loading").durationMinutes(90).build());
            resources = Arrays.asList("React Documentation (react.dev)", "TypeScript Deep Dive", "Refactoring UI by Adam Wathan & Steve Schoger");
        } else {
            techSeq = Arrays.asList(role + " Core Language", "Data Architecture & SQL", "REST API & Microservices", "Security & Authentication", "Cloud Containers & CI/CD");
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 1: Language Core").topic(role + " Syntax & OOP").activity("Master foundational concepts and design patterns").durationMinutes(90).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 2: Persistence").topic("Relational DB & SQL").activity("Design normalized schemas and write optimized SQL queries").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 3: API Layer").topic("REST API Architecture").activity("Implement secure service layers and input validation").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 4: Performance").topic("Caching & Async Queues").activity("Integrate Redis caching and async background task queues").durationMinutes(120).build());
            days.add(AILearningPlanDto.StudyDay.builder().day("Day 5: Infrastructure").topic("Docker Containerization").activity("Write multi-stage Dockerfiles and deployment pipelines").durationMinutes(120).build());
            resources = Arrays.asList("Designing Data-Intensive Applications", "System Design Primer & Scalability Workbook", "GitHub Open-Source Code Repositories");
        }

        return AILearningPlanDto.builder()
            .targetRole(role)
            .technologySequence(techSeq)
            .weeklyPlan(days)
            .recommendedResources(resources)
            .difficultyProgression(difficulty)
            .build();
    }


    @Override
    public AIMockInterviewDto generateMockInterview(final String targetRole, final String difficulty, final String contextJson) {
        final String role = (targetRole != null && !targetRole.isBlank()) ? targetRole : "Software Engineer";
        final String diff = (difficulty != null && !difficulty.isBlank()) ? difficulty.toUpperCase() : "INTERMEDIATE";
        final String roleLower = role.toLowerCase();

        final List<AIMockInterviewDto.InterviewQuestion> qList = new ArrayList<>();

        if (roleLower.contains("data") || roleLower.contains("machine") || roleLower.contains("ai")) {
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("TECHNICAL")
                .questionText("How do you handle feature selection, L1/L2 regularization, and data leakage when training predictive models for " + role + "?")
                .expectedAnswerKeyPoints("Discuss cross-validation, Lasso/Ridge regression penalties, correlation analysis, and data scaling within cross-validation folds.")
                .followUpQuestions(Arrays.asList("What is the difference between SHAP and LIME model explainability techniques?"))
                .build());
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("SYSTEM_DESIGN")
                .questionText("Design a real-time ML inference pipeline serving 10,000 requests/sec with feature store integration.")
                .expectedAnswerKeyPoints("Cover Redis online feature store, model versioning (MLflow), FastAPI container deployment, and Kafka streaming.")
                .followUpQuestions(Arrays.asList("How do you detect data drift and concept drift in production?"))
                .build());
        } else if (roleLower.contains("front") || roleLower.contains("react") || roleLower.contains("ui")) {
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("TECHNICAL")
                .questionText("Explain React 18 Concurrent Rendering, Server Components vs Client Components, and performance optimization techniques.")
                .expectedAnswerKeyPoints("Discuss fiber reconciler, non-blocking transitions with useTransition, zero-bundle-size server components, and Core Web Vitals optimization.")
                .followUpQuestions(Arrays.asList("How do you prevent memory leaks when managing WebSocket connections in custom React hooks?"))
                .build());
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("SYSTEM_DESIGN")
                .questionText("Design an accessible, responsive Design System component library with micro-frontend routing.")
                .expectedAnswerKeyPoints("Discuss TailwindCSS design tokens, ARIA attributes, module federation, and automated visual regression testing.")
                .followUpQuestions(Arrays.asList("How do you enforce performance budgets on dynamic JS bundle sizes?"))
                .build());
        } else if (roleLower.contains("devops") || roleLower.contains("cloud") || roleLower.contains("infrastructure")) {
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("TECHNICAL")
                .questionText("A Kubernetes Pod is stuck in CrashLoopBackOff state in production. Detail your step-by-step diagnostic process.")
                .expectedAnswerKeyPoints("Inspect kubectl describe, check container exit codes, review previous logs, verify Liveness/Readiness probes, and check resource limits.")
                .followUpQuestions(Arrays.asList("What is the difference between pod evictions and OOMKilled events?"))
                .build());
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("SYSTEM_DESIGN")
                .questionText("Design a zero-downtime, multi-region Blue/Green deployment pipeline using Infrastructure as Code.")
                .expectedAnswerKeyPoints("Use Terraform for provisioning, ArgoCD for GitOps CD, Route53 DNS weighted routing, and automated health canary rollbacks.")
                .followUpQuestions(Arrays.asList("How do you handle database migration schema changes during blue/green rollouts?"))
                .build());
        } else {
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("TECHNICAL")
                .questionText("How do you design high-throughput REST APIs and data access layers for " + role + " applications?")
                .expectedAnswerKeyPoints("Discuss separation of concerns (Controller-Service-Repository), database indexing, connection pooling, and connection handling.")
                .followUpQuestions(Arrays.asList("How do you prevent N+1 query problems in ORM data access layers?"))
                .build());
            qList.add(AIMockInterviewDto.InterviewQuestion.builder()
                .id(UUID.randomUUID().toString())
                .category("SYSTEM_DESIGN")
                .questionText("How would you design a scalable REST API rate limiter for " + role + " endpoints?")
                .expectedAnswerKeyPoints("Token bucket or sliding window log algorithm using Redis distributed cache.")
                .followUpQuestions(Arrays.asList("What HTTP status code and headers should be returned when a client exceeds rate limits?"))
                .build());
        }

        qList.add(AIMockInterviewDto.InterviewQuestion.builder()
            .id(UUID.randomUUID().toString())
            .category("BEHAVIORAL")
            .questionText("Describe a challenging technical bug or architecture disagreement you encountered as a " + role + " and how you resolved it.")
            .expectedAnswerKeyPoints("Use STAR method (Situation, Task, Action, Result). Highlight analytical debugging and collaborative decision making.")
            .followUpQuestions(Arrays.asList("What preventative measures or automated tests did you introduce after fixing the issue?"))
            .build());

        return AIMockInterviewDto.builder()
            .targetRole(role)
            .difficultyLevel(diff)
            .questions(qList)
            .evaluationRubric(Arrays.asList(
                "Technical Accuracy (40%)",
                "Problem Solving Approach (30%)",
                "Communication & Structure (20%)",
                "System Tradeoff Awareness (10%)"
            ))
            .build();
    }


    @Override
    public AIProjectAdviceDto analyzeProject(final String title, final String techStack, final String description, final String contextJson) {
        return AIProjectAdviceDto.builder()
            .projectId(UUID.randomUUID())
            .projectTitle(title != null ? title : "Full-Stack Project")
            .architectureImprovements(Arrays.asList(
                "Extract business logic from controllers into dedicated Service layers.",
                "Implement Global Exception Handler with standardized JSON envelopes."
            ))
            .technologyUpgrades(Arrays.asList("Upgrade Java to version 21", "Migrate to Vite React 18 with TypeScript"))
            .cloudImprovements(Arrays.asList("Containerize using multi-stage Docker builds", "Deploy to AWS EC2 or Render"))
            .securityImprovements(Arrays.asList("Enforce HTTPS and JWT bearer token authentication", "Sanitize SQL input to prevent injection"))
            .databaseImprovements(Arrays.asList("Add indexes on foreign key columns", "Use Flyway / Liquibase database migrations"))
            .scalabilityImprovements(Arrays.asList("Integrate Redis caching layer for read-heavy API queries"))
            .deploymentImprovements(Arrays.asList("Set up GitHub Actions CI/CD workflow for automated testing and deployment"))
            .build();
    }

    @Override
    public String generateChatResponse(final String userMessage, final String conversationHistory, final String contextJson) {
        String apiKey = System.getenv("GROQ_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getProperty("GROQ_API_KEY");
        }

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://api.groq.com/openai/v1/chat/completions";

                final String validApiKey = Objects.requireNonNull(apiKey.trim());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(validApiKey);

                Map<String, Object> body = new HashMap<>();
                body.put("model", "llama-3.3-70b-versatile");
                body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are CareerOS AI, an elite technical career advisor for engineering students."),
                    Map.of("role", "user", "content", userMessage != null ? userMessage : "")
                ));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
                Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);

                if (response != null && response.containsKey("choices")) {
                    Object choicesObj = response.get("choices");
                    if (choicesObj instanceof List<?> choices && !choices.isEmpty()) {
                        Object firstChoiceObj = choices.get(0);
                        if (firstChoiceObj instanceof Map<?, ?> firstChoice) {
                            Object messageObj = firstChoice.get("message");
                            if (messageObj instanceof Map<?, ?> message) {
                                Object contentObj = message.get("content");
                                if (contentObj instanceof String replyText) {
                                    return replyText;
                                }
                            }
                        }
                    }
                }
            } catch (HttpStatusCodeException e) {
                String responseBody = e.getResponseBodyAsString();
                return "Groq API Error (" + e.getStatusCode() + "): " + (responseBody != null && !responseBody.isEmpty() ? responseBody : e.getMessage());
            } catch (Exception e) {
                // Fallback to local mock if API fails
            }
        }

        final String msg = userMessage != null ? userMessage.toLowerCase() : "";

        if (msg.contains("weather") || msg.contains("movie") || msg.contains("recipe") || msg.contains("sports")) {
            return "I am CareerOS AI Copilot, your specialized career and education assistant. I can only assist with career strategy, resume optimization, interview prep, skill development, and placement guidance.";
        }

        if (msg.contains("score") || msg.contains("improve")) {
            return "Based on your candidate profile context, your overall Career Score can be improved by adding 2 portfolio projects with public GitHub repos and adding 3 missing skills to your skill matrix.";
        }

        if (msg.contains("resume") || msg.contains("ats")) {
            return "Your active PDF resume is parsed cleanly by ATS scanners. Make sure your project descriptions include quantitative metrics and action verbs like 'Architected', 'Engineered', and 'Optimized'.";
        }

        if (msg.contains("interview") || msg.contains("prepare")) {
            return "To prepare for software engineering interviews, focus on core Data Structures (HashMaps, Trees, Graphs), Spring Boot REST API design, and practice technical questions in our AI Mock Interview Simulator!";
        }

        return "I've reviewed your grounded profile context. Based on your target career goals, I recommend focusing on mastering Spring Boot microservices, building a full-stack project, and maintaining a high profile completeness index.";
    }
}
