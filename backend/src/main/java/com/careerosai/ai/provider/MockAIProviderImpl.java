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
        final List<AILearningPlanDto.StudyDay> days = new ArrayList<>();
        days.add(AILearningPlanDto.StudyDay.builder().day("Monday").topic("Data Structures & Algorithms").activity("Solve 2 Array & Hash Map Medium problems on LeetCode").durationMinutes(60).build());
        days.add(AILearningPlanDto.StudyDay.builder().day("Tuesday").topic("Backend REST APIs").activity("Implement JWT authentication filter in Spring Boot").durationMinutes(90).build());
        days.add(AILearningPlanDto.StudyDay.builder().day("Wednesday").topic("Database Systems").activity("Write complex SQL Joins and PostgreSQL index queries").durationMinutes(60).build());
        days.add(AILearningPlanDto.StudyDay.builder().day("Thursday").topic("Frontend Architecture").activity("Build custom React hooks and state management with TypeScript").durationMinutes(90).build());
        days.add(AILearningPlanDto.StudyDay.builder().day("Friday").topic("DevOps & Containers").activity("Write Dockerfile and containerize Spring Boot & React services").durationMinutes(60).build());

        return AILearningPlanDto.builder()
            .targetRole(targetRole != null ? targetRole : "Software Engineer")
            .technologySequence(Arrays.asList("Java / Python", "Spring Boot / Node", "PostgreSQL", "React", "Docker"))
            .weeklyPlan(days)
            .recommendedResources(Arrays.asList(
                "Coursera: Java Programming & Software Engineering Fundamentals",
                "NPTEL: Microservices & Cloud Architecture by IIT Kharagpur",
                "LeetCode: Top 150 Interview Study Plan"
            ))
            .difficultyProgression("Beginner -> Intermediate -> Advanced Placement Level")
            .build();
    }

    @Override
    public AIMockInterviewDto generateMockInterview(final String targetRole, final String difficulty, final String contextJson) {
        final List<AIMockInterviewDto.InterviewQuestion> qList = new ArrayList<>();

        qList.add(AIMockInterviewDto.InterviewQuestion.builder()
            .id(UUID.randomUUID().toString())
            .category("TECHNICAL")
            .questionText("Explain the difference between HashMap and ConcurrentHashMap in Java. When should you use each?")
            .expectedAnswerKeyPoints("HashMap is non-thread-safe. ConcurrentHashMap uses segment/bucket level locking allowing concurrent reads and writes.")
            .followUpQuestions(Arrays.asList("How does ConcurrentHashMap achieve thread safety without locking the entire map?"))
            .build());

        qList.add(AIMockInterviewDto.InterviewQuestion.builder()
            .id(UUID.randomUUID().toString())
            .category("SYSTEM_DESIGN")
            .questionText("How would you design a scalable REST API rate limiter for CareerOS AI endpoints?")
            .expectedAnswerKeyPoints("Token bucket or sliding window log algorithm using Redis distributed cache.")
            .followUpQuestions(Arrays.asList("What HTTP status code should be returned when a client exceeds rate limits?"))
            .build());

        qList.add(AIMockInterviewDto.InterviewQuestion.builder()
            .id(UUID.randomUUID().toString())
            .category("BEHAVIORAL")
            .questionText("Describe a challenging technical bug you encountered in a recent project and how you resolved it.")
            .expectedAnswerKeyPoints("Use STAR method (Situation, Task, Action, Result). Highlight systematic debugging using logs.")
            .followUpQuestions(Arrays.asList("What preventative measures did you take after fixing the bug?"))
            .build());

        return AIMockInterviewDto.builder()
            .targetRole(targetRole != null ? targetRole : "Software Engineer")
            .difficultyLevel(difficulty != null ? difficulty : "INTERMEDIATE")
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
        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getProperty("OPENAI_API_KEY");
        }

        if (apiKey != null && !apiKey.trim().isEmpty()) {
            try {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://api.openai.com/v1/chat/completions";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey.trim());

                Map<String, Object> body = new HashMap<>();
                body.put("model", "gpt-4o-mini");
                body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are CareerOS AI, an expert technical career coach helping engineering students with resumes, career scores, and interview prep."),
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
                return "OpenAI API Error (" + e.getStatusCode() + "): " + (responseBody != null && !responseBody.isEmpty() ? responseBody : e.getMessage());
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
