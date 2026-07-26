package com.careerosai.controller;

import com.careerosai.entity.AuditLog;
import com.careerosai.entity.SystemAlert;
import com.careerosai.observability.alerts.SystemAlertService;
import com.careerosai.observability.audit.AuditLogService;
import com.careerosai.observability.dto.ObservabilityDashboardDto;
import com.careerosai.observability.health.HealthCheckService;
import com.careerosai.observability.metrics.ObservabilityMetricsEngine;
import com.careerosai.observability.monitoring.ObservabilityMonitoringService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/observability")
@RequiredArgsConstructor
public class ObservabilityAdminController {

    private final HealthCheckService healthCheckService;
    private final ObservabilityMetricsEngine metricsEngine;
    private final SystemAlertService systemAlertService;
    private final AuditLogService auditLogService;
    private final ObservabilityMonitoringService monitoringService;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("System health check retrieved", healthCheckService.getComprehensiveHealth(), request.getRequestURI()));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("System metrics retrieved", metricsEngine.collectMetrics(), request.getRequestURI()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<SystemAlert>>> getAlerts(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("System alerts retrieved", systemAlertService.getRecentAlerts(), request.getRequestURI()));
    }

    @PostMapping("/alerts/{id}/resolve")
    public ResponseEntity<ApiResponse<SystemAlert>> resolveAlert(@PathVariable("id") final UUID alertId, final HttpServletRequest request) {
        final SystemAlert alert = systemAlertService.resolveAlert(alertId);
        return ResponseEntity.ok(ApiResponse.success("Alert resolved", alert, request.getRequestURI()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", auditLogService.getRecentAuditLogs(), request.getRequestURI()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<ObservabilityDashboardDto>> getDashboard(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Observability dashboard retrieved", monitoringService.getDashboardData(), request.getRequestURI()));
    }
}
