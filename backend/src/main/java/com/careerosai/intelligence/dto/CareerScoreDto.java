package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerScoreDto {
    private int overallScore; // 0 - 1000
    private String tier; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private int profileCompletenessPercentage; // 0 - 100
    private int atsReadinessPercentage; // 0 - 100
    private long skillsCount;
    private long projectsCount;
    private long experienceCount;
    private long certificatesCount;
    private long educationCount;
    private Map<String, Integer> categoryScores; // Weighted scores (points)
    private Map<String, String> categoryWeights; // Percentage weights string
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementAreas;
    private Instant lastCalculated;
}

