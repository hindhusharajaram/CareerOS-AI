package com.careerosai.analytics.events;

import java.util.UUID;

public class CareerScoreGeneratedEvent extends BasePlatformEvent {

    public CareerScoreGeneratedEvent(final UUID userId, final int overallScore) {
        super(
            "CAREER_SCORE_GENERATED",
            userId,
            null,
            null,
            "CAREER_INTELLIGENCE_MODULE",
            "{\"overallScore\":" + overallScore + "}"
        );
    }
}
