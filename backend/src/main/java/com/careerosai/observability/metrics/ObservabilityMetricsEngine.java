package com.careerosai.observability.metrics;

import com.careerosai.entity.SystemMetric;
import com.careerosai.repository.SystemMetricRepository;
import com.careerosai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class ObservabilityMetricsEngine {

    private final SystemMetricRepository systemMetricRepository;
    private final UserRepository userRepository;

    private final AtomicLong totalApiRequests = new AtomicLong(0);
    private final AtomicLong totalApiErrors = new AtomicLong(0);
    private final AtomicLong totalApiLatencyMs = new AtomicLong(0);
    private final AtomicLong lastEtlDurationMs = new AtomicLong(145);
    private final AtomicLong lastEventProcessingLatencyMs = new AtomicLong(12);

    public void recordApiCall(final long latencyMs, final boolean isError) {
        totalApiRequests.incrementAndGet();
        totalApiLatencyMs.addAndGet(latencyMs);
        if (isError) {
            totalApiErrors.incrementAndGet();
        }
    }

    public void recordEtlExecution(final long durationMs) {
        lastEtlDurationMs.set(durationMs);
    }

    public void recordEventProcessingLatency(final long latencyMs) {
        lastEventProcessingLatencyMs.set(latencyMs);
    }

    public Map<String, Object> collectMetrics() {
        final Map<String, Object> metrics = new LinkedHashMap<>();

        final long reqCount = totalApiRequests.get();
        final long errorCount = totalApiErrors.get();
        final double avgLatency = reqCount == 0 ? 0.0 : (double) totalApiLatencyMs.get() / reqCount;
        final double errorRatePercentage = reqCount == 0 ? 0.0 : ((double) errorCount / reqCount) * 100.0;

        // Active Users count
        long activeUserCount = 0;
        try {
            activeUserCount = userRepository.count();
        } catch (Exception e) {
            log.warn("Failed to count active users for metrics: {}", e.getMessage());
        }

        // JVM Telemetry
        final Runtime runtime = Runtime.getRuntime();
        final long maxMem = runtime.maxMemory() / (1024 * 1024);
        final long totalMem = runtime.totalMemory() / (1024 * 1024);
        final long freeMem = runtime.freeMemory() / (1024 * 1024);
        final long usedMem = totalMem - freeMem;

        final ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        final int threadCount = threadBean.getThreadCount();

        // Sample DB Query Latency Probe
        long dbQueryLatencyMs = 0;
        final long dbStart = System.currentTimeMillis();
        try {
            userRepository.count();
            dbQueryLatencyMs = System.currentTimeMillis() - dbStart;
        } catch (Exception e) {
            dbQueryLatencyMs = -1;
        }

        metrics.put("requestCount", reqCount);
        metrics.put("errorCount", errorCount);
        metrics.put("errorRatePercentage", errorRatePercentage);
        metrics.put("averageLatencyMs", avgLatency);
        metrics.put("activeUsers", activeUserCount);
        metrics.put("jvmMaxMemoryMb", maxMem);
        metrics.put("jvmTotalMemoryMb", totalMem);
        metrics.put("jvmFreeMemoryMb", freeMem);
        metrics.put("jvmUsedMemoryMb", usedMem);
        metrics.put("heapUsagePercentage", (double) usedMem / (maxMem > 0 ? maxMem : 1) * 100);
        metrics.put("threadCount", threadCount);
        metrics.put("dbQueryLatencyMs", dbQueryLatencyMs);
        metrics.put("etlExecutionTimeMs", lastEtlDurationMs.get());
        metrics.put("eventProcessingLatencyMs", lastEventProcessingLatencyMs.get());

        return metrics;
    }

    public void persistMetricsSnapshot() {
        try {
            final Map<String, Object> data = collectMetrics();
            saveMetric("api.latency.avg", ((Number) data.get("averageLatencyMs")).doubleValue(), "ms");
            saveMetric("api.requests.total", ((Number) data.get("requestCount")).doubleValue(), "count");
            saveMetric("api.error_rate", ((Number) data.get("errorRatePercentage")).doubleValue(), "%");
            saveMetric("jvm.memory.used", ((Number) data.get("jvmUsedMemoryMb")).doubleValue(), "MB");
            saveMetric("jvm.threads.count", ((Number) data.get("threadCount")).doubleValue(), "threads");
            saveMetric("db.query.latency", ((Number) data.get("dbQueryLatencyMs")).doubleValue(), "ms");
            saveMetric("etl.execution.time", ((Number) data.get("etlExecutionTimeMs")).doubleValue(), "ms");
            saveMetric("event.processing.latency", ((Number) data.get("eventProcessingLatencyMs")).doubleValue(), "ms");
        } catch (Exception e) {
            log.error("Failed to persist system metrics snapshot: {}", e.getMessage());
        }
    }

    private void saveMetric(final String name, final double val, final String unit) {
        final SystemMetric metric = SystemMetric.builder()
            .metricName(name)
            .metricValue(val)
            .metricUnit(unit)
            .createdAt(LocalDateTime.now())
            .build();
        systemMetricRepository.save(Objects.requireNonNull(metric));
    }
}
