package com.careerosai.service;

import com.careerosai.dto.AtsCategoryScoreDto;

import com.careerosai.dto.InsightDto;
import com.careerosai.dto.KeywordAnalysisDto;
import com.careerosai.dto.SectionHeatmapDto;

import java.util.List;

/**
 * Service for generating priority-categorized actionable resume insights (HIGH, MEDIUM, LOW).
 */
public interface ResumeInsightsService {
    List<InsightDto> generateInsights(
        String rawText,
        List<AtsCategoryScoreDto> categories,
        List<SectionHeatmapDto> heatmap,
        KeywordAnalysisDto keywords
    );
}
