package com.careerosai.analytics.events;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public abstract class BasePlatformEvent {

    private final UUID eventId;
    private final String eventType;
    private final UUID userId;
    private final Instant timestamp;
    private final String correlationId;
    private final String sessionId;
    private final String sourceModule;
    private final String payloadJson;

    public BasePlatformEvent(
        final String eventType,
        final UUID userId,
        final String correlationId,
        final String sessionId,
        final String sourceModule,
        final String payloadJson
    ) {
        this.eventId = UUID.randomUUID();
        this.eventType = eventType;
        this.userId = userId;
        this.timestamp = Instant.now();
        this.correlationId = correlationId != null ? correlationId : UUID.randomUUID().toString();
        this.sessionId = sessionId;
        this.sourceModule = sourceModule != null ? sourceModule : "PLATFORM_CORE";
        this.payloadJson = payloadJson != null ? payloadJson : "{}";
    }
}
