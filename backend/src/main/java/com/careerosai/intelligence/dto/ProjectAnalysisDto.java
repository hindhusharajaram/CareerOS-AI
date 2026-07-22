package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAnalysisDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SingleProjectAnalysis {
        private UUID projectId;
        private String title;
        private int qualityScore; // 0 - 100
        private String difficultyRating; // EASY, INTERMEDIATE, ADVANCED
        private boolean hasGithub;
        private boolean hasLiveDemo;
        private List<String> suggestions;
    }

    private int overallProjectScore;
    private List<SingleProjectAnalysis> projectAnalyses;
    private List<String> recommendedImprovements;
}
