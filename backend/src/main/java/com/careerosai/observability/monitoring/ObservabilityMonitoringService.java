package com.careerosai.observability.monitoring;

import com.careerosai.analytics.metrics.MetricsService;
import com.careerosai.observability.alerts.SystemAlertService;
import com.careerosai.observability.audit.AuditLogService;
import com.careerosai.observability.dto.ObservabilityDashboardDto;
import com.careerosai.observability.health.HealthCheckService;
import com.careerosai.observability.metrics.ObservabilityMetricsEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ObservabilityMonitoringService {

    private final HealthCheckService healthCheckService;
    private final ObservabilityMetricsEngine metricsEngine;
    private final SystemAlertService alertService;
    private final AuditLogService auditLogService;
    private final MetricsService legacyMetricsService;

    public ObservabilityDashboardDto getDashboardData() {
        final Map<String, Object> health = healthCheckService.getComprehensiveHealth();
        final Map<String, Object> metrics = metricsEngine.collectMetrics();

        final double avgLatency = ((Number) metrics.getOrDefault("averageLatencyMs", 0.0)).doubleValue();
        final double eventSuccessRate = legacyMetricsService.getSuccessRatePercentage();
        final long totalProcessed = legacyMetricsService.getTotalEventsProcessed();

        return ObservabilityDashboardDto.builder()
            .healthSummary(health)
            .liveMetrics(metrics)
            .activeAlerts(alertService.getRecentAlerts())
            .recentAuditLogs(auditLogService.getRecentAuditLogs())
            .apiAverageLatencyMs(avgLatency)
            .eventConsumerSuccessRate(eventSuccessRate)
            .totalEventsProcessed(totalProcessed)
            .build();
    }
}
