package com.careerosai.analytics.producer;

import com.careerosai.analytics.events.BasePlatformEvent;

public interface EventPublisherService {
    void publishEvent(BasePlatformEvent event);
}
