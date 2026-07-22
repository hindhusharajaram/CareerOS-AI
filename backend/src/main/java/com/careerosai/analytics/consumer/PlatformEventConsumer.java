package com.careerosai.analytics.consumer;

import com.careerosai.analytics.events.BasePlatformEvent;
import com.careerosai.analytics.metrics.MetricsService;
import com.careerosai.entity.AnalyticsEvent;
import com.careerosai.entity.AnalyticsFailure;
import com.careerosai.entity.AnalyticsFeatureUsage;
import com.careerosai.entity.User;
import com.careerosai.repository.AnalyticsEventRepository;
import com.careerosai.repository.AnalyticsFailureRepository;
import com.careerosai.repository.AnalyticsFeatureUsageRepository;
import com.careerosai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlatformEventConsumer {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final AnalyticsFeatureUsageRepository analyticsFeatureUsageRepository;
    private final AnalyticsFailureRepository analyticsFailureRepository;
    private final UserRepository userRepository;
    private final MetricsService metricsService;

    @Async
    @EventListener
    public void handlePlatformEvent(final BasePlatformEvent event) {
        final long startTime = System.currentTimeMillis();
        try {
            if (event == null || event.getUserId() == null) return;

            final Optional<User> userOpt = userRepository.findById(event.getUserId());
            if (userOpt.isPresent()) {
                // 1. Persist Event
                analyticsEventRepository.save(AnalyticsEvent.builder()
                    .user(userOpt.get())
                    .eventType(event.getEventType())
                    .eventDetails(event.getPayloadJson())
                    .build());

                // 2. Increment Feature Usage Counter
                final String featureName = event.getEventType();
                final AnalyticsFeatureUsage featureUsage = analyticsFeatureUsageRepository.findByFeatureName(featureName)
                    .orElseGet(() -> AnalyticsFeatureUsage.builder()
                        .featureName(featureName)
                        .usageCount(0L)
                        .lastUsedAt(LocalDateTime.now())
                        .build());
                featureUsage.setUsageCount(featureUsage.getUsageCount() + 1);
                featureUsage.setLastUsedAt(LocalDateTime.now());
                analyticsFeatureUsageRepository.save(featureUsage);
            }

            final long duration = System.currentTimeMillis() - startTime;
            metricsService.recordEventProcessed(duration);
            log.info("Successfully processed event [{}] in {} ms", event.getEventType(), duration);

        } catch (Exception e) {
            log.error("Error processing event [{}]: {}", event != null ? event.getEventType() : "NULL", e.getMessage(), e);
            metricsService.recordEventFailed();
            try {
                analyticsFailureRepository.save(AnalyticsFailure.builder()
                    .eventId(event != null ? event.getEventId() : null)
                    .eventType(event != null ? event.getEventType() : "UNKNOWN")
                    .errorMessage(e.getMessage())
                    .retryCount(1)
                    .build());
            } catch (Exception ex) {
                log.error("Failed to log event failure to database: {}", ex.getMessage());
            }
        }
    }
}
