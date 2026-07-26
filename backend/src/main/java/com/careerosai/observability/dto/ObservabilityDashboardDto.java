package com.careerosai.observability.dto;

import com.careerosai.entity.AuditLog;
import com.careerosai.entity.SystemAlert;
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
public class ObservabilityDashboardDto {
    private Map<String, Object> healthSummary;
    private Map<String, Object> liveMetrics;
    private List<SystemAlert> activeAlerts;
    private List<AuditLog> recentAuditLogs;
    private double apiAverageLatencyMs;
    private double eventConsumerSuccessRate;
    private long totalEventsProcessed;
}
