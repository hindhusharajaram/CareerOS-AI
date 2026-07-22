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
public class AILearningPlanDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudyDay {
        private String day;
        private String topic;
        private String activity;
        private int durationMinutes;
    }

    private String targetRole;
    private List<String> technologySequence;
    private List<StudyDay> weeklyPlan;
    private List<String> recommendedResources;
    private String difficultyProgression;
}
