package com.careerosai.service.impl;

import com.careerosai.dto.AtsCategoryScoreDto;

import com.careerosai.dto.InsightDto;
import com.careerosai.dto.KeywordAnalysisDto;
import com.careerosai.dto.SectionHeatmapDto;
import com.careerosai.service.ResumeInsightsService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of ResumeInsightsService.
 */
@Service
public class ResumeInsightsServiceImpl implements ResumeInsightsService {

    @Override
    public List<InsightDto> generateInsights(
        final String rawText,
        final List<AtsCategoryScoreDto> categories,
        final List<SectionHeatmapDto> heatmap,
        final KeywordAnalysisDto keywords
    ) {
        final List<InsightDto> insights = new ArrayList<>();

        // HIGH Priority Checks
        if (heatmap != null) {
            for (SectionHeatmapDto sec : heatmap) {
                if ("Missing".equalsIgnoreCase(sec.getStatus()) &&
                    ("Education".equalsIgnoreCase(sec.getSection()) || "Technical Skills".equalsIgnoreCase(sec.getSection()) || "Skills".equalsIgnoreCase(sec.getSection()))) {
                    insights.add(new InsightDto("Structure", "Missing core section: " + sec.getSection() + ". Add this immediately for ATS compliance.", "HIGH"));
                }
            }
        }

        if (keywords != null && keywords.getCoveragePercentage() < 50.0) {
            insights.add(new InsightDto("Keywords", "Software Engineering keyword coverage is under 50%. Incorporate core keywords like Spring Boot, React, Docker, and AWS.", "HIGH"));
        }

        if (categories != null) {
            for (AtsCategoryScoreDto cat : categories) {
                if ("Action Verbs".equalsIgnoreCase(cat.getCategory()) && cat.getCurrentScore() < 6) {
                    insights.add(new InsightDto("Impact", "Weak action verbs detected. Initiate experience bullet points with verbs like 'Engineered', 'Architected', or 'Optimized'.", "HIGH"));
                }
            }
        }

        // MEDIUM Priority Checks
        if (heatmap != null) {
            for (SectionHeatmapDto sec : heatmap) {
                if ("Missing".equalsIgnoreCase(sec.getStatus()) && "Open Source".equalsIgnoreCase(sec.getSection())) {
                    insights.add(new InsightDto("Portfolio", "Add a GitHub or Open Source contribution section to showcase production codebase experience.", "MEDIUM"));
                }
                if ("Partial".equalsIgnoreCase(sec.getStatus()) && "Experience".equalsIgnoreCase(sec.getSection())) {
                    insights.add(new InsightDto("Metrics", "Work experience bullet points lack measurable metric outcomes (e.g., %, user count, latency).", "MEDIUM"));
                }
            }
        }

        if (keywords != null && !keywords.getMissingKeywords().isEmpty() && keywords.getMissingKeywords().size() >= 3) {
            final List<String> top3 = keywords.getMissingKeywords().subList(0, 3);
            insights.add(new InsightDto("Keywords", "Consider adding high-demand industry keywords if applicable: " + String.join(", ", top3) + ".", "MEDIUM"));
        }

        // LOW Priority Checks
        if (heatmap != null) {
            for (SectionHeatmapDto sec : heatmap) {
                if ("Missing".equalsIgnoreCase(sec.getStatus()) && "Certifications".equalsIgnoreCase(sec.getSection())) {
                    insights.add(new InsightDto("Certifications", "Consider completing and listing industry certifications (e.g. AWS Certified Developer, Oracle Java).", "LOW"));
                }
            }
        }

        insights.add(new InsightDto("Formatting", "Ensure consistent font hierarchy, standard bullet point styling, and clear 1-inch margins throughout the document.", "LOW"));

        return insights;
    }
}
