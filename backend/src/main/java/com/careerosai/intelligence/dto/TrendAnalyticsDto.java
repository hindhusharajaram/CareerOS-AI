package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendAnalyticsDto {
    private Map<String, Integer> mostCommonSkills;
    private Map<String, Integer> missingSkillsDistribution;
    private Map<String, Integer> technologyDistribution;
    private Map<String, Integer> projectCategoryDistribution;
    private Map<String, Integer> certificateDistribution;
    private Map<String, Integer> careerGoalTrends;
    private Map<String, Integer> profileScoreDistribution;
}
