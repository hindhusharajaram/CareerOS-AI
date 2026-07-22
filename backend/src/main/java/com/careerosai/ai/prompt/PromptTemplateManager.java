package com.careerosai.ai.prompt;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PromptTemplateManager {

    private final Map<String, String> templates = new HashMap<>();

    public PromptTemplateManager() {
        templates.put("COPILOT_EXPLAIN", "Act as CareerOS AI Copilot. Topic: {{topic}}. Grounded Context: {{context}}. Explain clearly with actionable takeaways.");
        templates.put("RESUME_REVIEW", "Review resume text: {{resumeText}}. Candidate Context: {{context}}. Provide ATS optimization advice, missing sections, and bullet point suggestions.");
        templates.put("LEARNING_PLAN", "Generate structured weekly study plan for role: {{targetRole}}. Candidate Context: {{context}}.");
        templates.put("MOCK_INTERVIEW", "Generate interview questions for target role: {{targetRole}}, difficulty: {{difficulty}}. Candidate Context: {{context}}.");
        templates.put("PROJECT_ADVICE", "Analyze software project title: {{title}}, tech stack: {{techStack}}. Context: {{context}}. Provide architecture and security improvements.");
    }

    public String getTemplate(final String key) {
        return templates.getOrDefault(key, "Context: {{context}}. Prompt: {{prompt}}");
    }
}
