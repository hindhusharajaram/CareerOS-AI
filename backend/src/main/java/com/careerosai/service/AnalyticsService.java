package com.careerosai.service;

import com.careerosai.entity.AnalyticsEvent;
import com.careerosai.entity.User;
import com.careerosai.repository.AnalyticsEventRepository;
import com.careerosai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final UserRepository userRepository;

    public void trackEvent(final UUID userId, final String eventType, final String eventDetails) {
        try {
            final UUID targetUserId = Objects.requireNonNull(userId);
            final User user = userRepository.findById(targetUserId).orElse(null);
            if (user != null) {
                final AnalyticsEvent event = AnalyticsEvent.builder()
                    .user(user)
                    .eventType(eventType)
                    .eventDetails(eventDetails)
                    .build();
                analyticsEventRepository.save(Objects.requireNonNull(event));
                log.info("Analytics Event tracked: [{}] for user [{}]", eventType, targetUserId);
            }
        } catch (Exception e) {
            log.warn("Failed to persist analytics event [{}]: {}", eventType, e.getMessage());
        }
    }
}
