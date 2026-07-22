package com.careerosai.analytics.metrics;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

@Service
public class MetricsService {

    private final AtomicLong totalEventsProcessed = new AtomicLong(0);
    private final AtomicLong totalEventsFailed = new AtomicLong(0);
    private final AtomicLong totalProcessingDurationMs = new AtomicLong(0);

    public void recordEventProcessed(final long durationMs) {
        totalEventsProcessed.incrementAndGet();
        totalProcessingDurationMs.addAndGet(durationMs);
    }

    public void recordEventFailed() {
        totalEventsFailed.incrementAndGet();
    }

    public long getTotalEventsProcessed() {
        return totalEventsProcessed.get();
    }

    public long getTotalEventsFailed() {
        return totalEventsFailed.get();
    }

    public double getAverageLatencyMs() {
        final long count = totalEventsProcessed.get();
        return count == 0 ? 0.0 : (double) totalProcessingDurationMs.get() / count;
    }

    public double getSuccessRatePercentage() {
        final long total = totalEventsProcessed.get() + totalEventsFailed.get();
        return total == 0 ? 100.0 : (double) totalEventsProcessed.get() / total * 100.0;
    }
}
