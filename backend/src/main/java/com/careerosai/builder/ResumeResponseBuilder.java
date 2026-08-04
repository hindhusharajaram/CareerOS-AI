package com.careerosai.builder;

import com.careerosai.dto.AtsCategoryScoreDto;

import com.careerosai.dto.InsightDto;
import com.careerosai.dto.KeywordAnalysisDto;
import com.careerosai.dto.QuantificationBulletDto;
import com.careerosai.dto.ResumeHealthDto;
import com.careerosai.dto.ResumeReviewResponseDto;
import com.careerosai.dto.SectionHeatmapDto;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Response Builder component for assembling clean, production-ready ResumeReviewResponseDto objects.
 * Security Requirement: Ensures raw extracted text is NEVER exposed in the API response.
 */
@Component
public class ResumeResponseBuilder {

    public ResumeReviewResponseDto buildResponse(
        final int overallScore,
        final ResumeHealthDto health,
        final List<AtsCategoryScoreDto> categoryBreakdown,
        final List<SectionHeatmapDto> heatmap,
        final KeywordAnalysisDto keywords,
        final List<QuantificationBulletDto> quantification,
        final List<InsightDto> insights,
        final String fileName
    ) {
        // Determine Grade Label
        final String grade;
        if (overallScore >= 85) {
            grade = "Excellent";
        } else if (overallScore >= 70) {
            grade = "Good";
        } else if (overallScore >= 50) {
            grade = "Needs Improvement";
        } else {
            grade = "Poor";
        }

        // Backward compatibility map
        final Map<String, Object> legacyBreakdownMap = new LinkedHashMap<>();
        if (categoryBreakdown != null) {
            for (AtsCategoryScoreDto cat : categoryBreakdown) {
                legacyBreakdownMap.put(cat.getCategory(), Map.of(
                    "score", cat.getCurrentScore(),
                    "max", cat.getMaxScore(),
                    "passed", cat.getCurrentScore() >= (cat.getMaxScore() * 0.6),
                    "explanation", cat.getExplanation()
                ));
            }
        }

        return ResumeReviewResponseDto.builder()
            .score(overallScore)
            .grade(grade)
            .health(health)
            .atsCategoryBreakdown(categoryBreakdown)
            .heatmap(heatmap)
            .keywords(keywords)
            .quantification(quantification)
            .insights(insights)
            .atsBreakdown(legacyBreakdownMap)
            .fileName(fileName)
            .build();
    }
}
