package com.careerosai.observability.config;

import com.careerosai.observability.health.HealthCheckService;
import com.careerosai.observability.metrics.ObservabilityMetricsEngine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class ObservabilityConfig {

    private final ObservabilityMetricsEngine metricsEngine;
    private final HealthCheckService healthCheckService;

    @Scheduled(fixedRate = 60000)
    public void scheduleTelemetrySnapshot() {
        try {
            metricsEngine.persistMetricsSnapshot();
            healthCheckService.recordSnapshot();
            log.debug("Automated observability telemetry & health snapshot recorded successfully.");
        } catch (Exception e) {
            log.error("Error during scheduled telemetry snapshot: {}", e.getMessage());
        }
    }
}
