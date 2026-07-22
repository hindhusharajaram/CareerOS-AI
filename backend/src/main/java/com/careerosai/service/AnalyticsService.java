package com.careerosai.service;

import com.careerosai.entity.AnalyticsEvent;
import com.careerosai.entity.User;
import com.careerosai.repository.AnalyticsEventRepository;
import com.careerosai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final UserRepository userRepository;

    public void trackEvent(final UUID userId, final String eventType, final String eventDetails) {
        try {
            final User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                analyticsEventRepository.save(AnalyticsEvent.builder()
                    .user(user)
                    .eventType(eventType)
                    .eventDetails(eventDetails)
                    .build());
                log.info("Analytics Event tracked: [{}] for user [{}]", eventType, userId);
            }
        } catch (Exception e) {
            log.warn("Failed to persist analytics event [{}]: {}", eventType, e.getMessage());
        }
    }
}
