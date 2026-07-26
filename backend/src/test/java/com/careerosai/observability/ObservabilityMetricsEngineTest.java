package com.careerosai.observability;

import com.careerosai.entity.SystemMetric;
import com.careerosai.observability.metrics.ObservabilityMetricsEngine;
import com.careerosai.repository.SystemMetricRepository;
import com.careerosai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ObservabilityMetricsEngineTest {

    @Mock
    private SystemMetricRepository systemMetricRepository;

    @Mock
    private UserRepository userRepository;

    private ObservabilityMetricsEngine metricsEngine;

    @BeforeEach
    void setUp() {
        metricsEngine = new ObservabilityMetricsEngine(systemMetricRepository, userRepository);
    }

    @Test
    @DisplayName("Should collect and calculate API latency and request metrics accurately")
    void testCollectMetrics() {
        when(userRepository.count()).thenReturn(25L);

        metricsEngine.recordApiCall(100, false);
        metricsEngine.recordApiCall(200, false);
        metricsEngine.recordApiCall(300, true); // error call

        Map<String, Object> metrics = metricsEngine.collectMetrics();

        assertNotNull(metrics);
        assertEquals(3L, metrics.get("requestCount"));
        assertEquals(1L, metrics.get("errorCount"));
        assertEquals(200.0, (Double) metrics.get("averageLatencyMs"), 0.01);
        assertEquals(33.333, (Double) metrics.get("errorRatePercentage"), 0.1);
        assertEquals(25L, metrics.get("activeUsers"));
    }

    @Test
    @DisplayName("Should persist metrics snapshot to repository")
    void testPersistMetricsSnapshot() {
        when(userRepository.count()).thenReturn(10L);
        when(systemMetricRepository.save(any(SystemMetric.class))).thenAnswer(i -> i.getArgument(0));

        metricsEngine.persistMetricsSnapshot();

        verify(systemMetricRepository, atLeast(5)).save(any(SystemMetric.class));
    }
}
