package com.careerosai.analytics.producer;

import com.careerosai.analytics.events.BasePlatformEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpringEventPublisherImpl implements EventPublisherService {

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public void publishEvent(final BasePlatformEvent event) {
        if (event == null) return;
        log.info("Publishing Platform Event: [{}] for User [{}]", event.getEventType(), event.getUserId());
        applicationEventPublisher.publishEvent(event);
    }
}
