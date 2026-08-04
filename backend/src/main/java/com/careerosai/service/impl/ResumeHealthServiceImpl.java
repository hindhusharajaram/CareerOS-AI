package com.careerosai.service.impl;

import com.careerosai.dto.ResumeHealthDto;
import com.careerosai.service.ResumeHealthService;
import org.springframework.stereotype.Service;

/**
 * Implementation of ResumeHealthService.
 */
@Service
public class ResumeHealthServiceImpl implements ResumeHealthService {

    @Override
    public ResumeHealthDto evaluateHealth(final int overallScore) {
        final String label;
        final String stars;
        final String percentile;
        final String readinessStatus;

        if (overallScore >= 90) {
            label = "Excellent";
            stars = "★★★★★";
            percentile = "Top 15%";
            readinessStatus = "Ready for Software Engineering Interviews";
        } else if (overallScore >= 80) {
            label = "Very Good";
            stars = "★★★★☆";
            percentile = "Top 25%";
            readinessStatus = "Interview Ready - Minor Polish Recommended";
        } else if (overallScore >= 70) {
            label = "Good";
            stars = "★★★☆☆";
            percentile = "Top 40%";
            readinessStatus = "Needs Polish Before Applying";
        } else if (overallScore >= 50) {
            label = "Needs Improvement";
            stars = "★★☆☆☆";
            percentile = "Top 60%";
            readinessStatus = "Action Required - Missing Core Sections";
        } else {
            label = "Poor";
            stars = "★☆☆☆☆";
            percentile = "Bottom 30%";
            readinessStatus = "Major Overhaul Required";
        }

        return ResumeHealthDto.builder()
            .score(overallScore)
            .label(label)
            .stars(stars)
            .percentile(percentile)
            .readinessStatus(readinessStatus)
            .build();
    }
}
