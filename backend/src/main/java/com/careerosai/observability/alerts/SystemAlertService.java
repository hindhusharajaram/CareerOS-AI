package com.careerosai.observability.alerts;

import com.careerosai.entity.SystemAlert;
import com.careerosai.repository.SystemAlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SystemAlertService {

    private final SystemAlertRepository systemAlertRepository;

    public SystemAlert createAlert(final String level, final String sourceModule, final String message) {
        log.warn("System Alert Raised [{} - {}]: {}", level, sourceModule, message);
        final SystemAlert alert = SystemAlert.builder()
            .alertLevel(level)
            .sourceModule(sourceModule)
            .message(message)
            .isResolved(false)
            .createdAt(LocalDateTime.now())
            .build();
        return Objects.requireNonNull(systemAlertRepository.save(Objects.requireNonNull(alert)));
    }

    public SystemAlert resolveAlert(final UUID alertId) {
        final UUID targetId = Objects.requireNonNull(alertId);
        return systemAlertRepository.findById(targetId).map(alert -> {
            alert.setResolved(true);
            log.info("System Alert Resolved [{}]", targetId);
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
