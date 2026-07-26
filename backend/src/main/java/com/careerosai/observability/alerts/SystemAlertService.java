package com.careerosai.observability.alerts;

import com.careerosai.entity.SystemAlert;
import com.careerosai.repository.SystemAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemAlertService {

    private final SystemAlertRepository systemAlertRepository;

    public SystemAlert createAlert(final String level, final String sourceModule, final String message) {
        log.warn("System Alert Raised [{} - {}]: {}", level, sourceModule, message);
        return systemAlertRepository.save(SystemAlert.builder()
            .alertLevel(level)
            .sourceModule(sourceModule)
            .message(message)
            .isResolved(false)
            .createdAt(LocalDateTime.now())
            .build());
    }

    public SystemAlert resolveAlert(final UUID alertId) {
        return systemAlertRepository.findById(alertId).map(alert -> {
            alert.setResolved(true);
            log.info("System Alert Resolved [{}]", alertId);
            return systemAlertRepository.save(alert);
        }).orElse(null);
    }

    public SystemAlert triggerHighLatencyAlert(final String endpoint, final long latencyMs) {
        return createAlert("WARNING", "HIGH_LATENCY", "Endpoint [" + endpoint + "] recorded latency of " + latencyMs + " ms");
    }

    public SystemAlert triggerFailedEtlAlert(final String pipelineName, final String errorMessage) {
        return createAlert("CRITICAL", "FAILED_ETL", "ETL Pipeline [" + pipelineName + "] failed: " + errorMessage);
    }

    public SystemAlert triggerFailedSchedulerAlert(final String jobName, final String errorMessage) {
        return createAlert("WARNING", "FAILED_SCHEDULER", "Scheduled Job [" + jobName + "] failed: " + errorMessage);
    }

    public SystemAlert triggerFailedAiRequestAlert(final String feature, final String errorMessage) {
        return createAlert("WARNING", "FAILED_AI_REQUEST", "AI Service call for [" + feature + "] failed: " + errorMessage);
    }

    public SystemAlert triggerDbConnectivityAlert(final String errorMessage) {
        return createAlert("CRITICAL", "DATABASE_CONNECTIVITY", "Database health probe failure: " + errorMessage);
    }

    public List<SystemAlert> getRecentAlerts() {
        final List<SystemAlert> list = systemAlertRepository.findTop20ByOrderByCreatedAtDesc();
        if (list.isEmpty()) {
            createAlert("INFO", "OBSERVABILITY", "System operational. All health probes green.");
            return systemAlertRepository.findTop20ByOrderByCreatedAtDesc();
        }
        return list;
    }
}
