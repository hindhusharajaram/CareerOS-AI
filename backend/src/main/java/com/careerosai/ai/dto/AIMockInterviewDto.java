package com.careerosai.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIMockInterviewDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewQuestion {
        private String id;
        private String category; // TECHNICAL, BEHAVIORAL, CODING, SYSTEM_DESIGN
        private String questionText;
        private String expectedAnswerKeyPoints;
        private List<String> followUpQuestions;
    }

    private String targetRole;
    private String difficultyLevel;
    private List<InterviewQuestion> questions;
    private List<String> evaluationRubric;
}
