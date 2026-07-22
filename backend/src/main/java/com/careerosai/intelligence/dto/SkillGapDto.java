package com.careerosai.intelligence.dto;

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
public class SkillGapDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapItem {
        private String skillName;
        private String category;
        private String priorityLevel; // HIGH, MEDIUM, LOW
        private String learningDifficulty; // EASY, INTERMEDIATE, HARD
        private int estimatedLearningHours;
    }

    private String preferredRole;
    private List<String> currentSkills;
    private List<SkillGapItem> missingSkills;
    private List<SkillGapItem> recommendedSkills;
}
