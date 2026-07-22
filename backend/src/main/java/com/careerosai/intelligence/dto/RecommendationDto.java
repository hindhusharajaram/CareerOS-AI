package com.careerosai.intelligence.dto;

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
public class RecommendationDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationItem {
        private String title;
        private String category; // ROLE, DOMAIN, TECHNOLOGY, CERTIFICATION, NPTEL_COURSE, PROJECT
        private String reason;
        private String priority; // HIGH, MEDIUM, LOW
        private double confidenceScore; // e.g. 0.85 - 0.98
    }

    private List<String> suitableRoles;
    private List<String> suitableDomains;
    private List<RecommendationItem> items;
    private int interviewReadinessScore; // 0 - 100
}
