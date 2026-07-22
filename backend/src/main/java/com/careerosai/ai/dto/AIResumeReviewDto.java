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
public class AIResumeReviewDto {
    private String professionalSummary;
    private List<String> improvementSuggestions;
    private List<String> missingSections;
    private List<String> actionItems;
    private List<String> strongBulletPointSuggestions;
    private List<String> atsOptimizationAdvice;
}
