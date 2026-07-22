package com.careerosai.ai.provider;

import com.careerosai.ai.dto.AICopilotExplanationDto;
import com.careerosai.ai.dto.AILearningPlanDto;
import com.careerosai.ai.dto.AIMockInterviewDto;
import com.careerosai.ai.dto.AIProjectAdviceDto;
import com.careerosai.ai.dto.AIResumeReviewDto;

public interface AIProvider {

    String getProviderName();

    AICopilotExplanationDto explainTopic(String topic, String prompt, String contextJson);

    AIResumeReviewDto reviewResume(String resumeText, String contextJson);

    AILearningPlanDto generateLearningPlan(String targetRole, String contextJson);

    AIMockInterviewDto generateMockInterview(String targetRole, String difficulty, String contextJson);

    AIProjectAdviceDto analyzeProject(String projectTitle, String techStack, String description, String contextJson);

    String generateChatResponse(String userMessage, String conversationHistory, String contextJson);
}
