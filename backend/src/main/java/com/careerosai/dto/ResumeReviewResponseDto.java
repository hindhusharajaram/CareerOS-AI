package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Top-Level Response DTO for Resume Review API.
 * Security Hardening Guarantee: Raw extracted text is NEVER exposed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeReviewResponseDto {

    private int score;
    private String grade;
    private ResumeHealthDto health;
    private List<AtsCategoryScoreDto> atsCategoryBreakdown;
    private List<SectionHeatmapDto> heatmap;
    private KeywordAnalysisDto keywords;
    private List<QuantificationBulletDto> quantification;
    private List<InsightDto> insights;
    private Map<String, Object> atsBreakdown;
    private String fileName;
}
