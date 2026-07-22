package com.careerosai.analytics.events;

import java.util.UUID;

public class ResumeUploadedEvent extends BasePlatformEvent {

    public ResumeUploadedEvent(final UUID userId, final String filename, final int version) {
        super(
            "RESUME_UPLOADED",
            userId,
            null,
            null,
            "FILE_INTELLIGENCE_MODULE",
            "{\"filename\":\"" + filename + "\",\"version\":" + version + "}"
        );
    }
}
