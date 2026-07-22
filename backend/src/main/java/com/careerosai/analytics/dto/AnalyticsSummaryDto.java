package com.careerosai.analytics.dto;

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
public class AnalyticsSummaryDto {
    private long totalEventsLogged;
    private int dailyActiveUsers;
    private int weeklyActiveUsers;
    private int monthlyActiveUsers;
    private double successRatePercentage;
    private double averageLatencyMs;
    private Map<String, Long> topFeatures;
    private List<String> systemHealthFlags;
}
