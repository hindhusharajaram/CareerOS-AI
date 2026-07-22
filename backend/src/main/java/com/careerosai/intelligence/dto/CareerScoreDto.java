package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerScoreDto {
    private int overallScore; // 0 - 1000
    private Map<String, Integer> categoryScores; // Weighted scores
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementAreas;
}
