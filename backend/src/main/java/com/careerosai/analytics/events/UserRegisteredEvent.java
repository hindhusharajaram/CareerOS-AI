package com.careerosai.analytics.events;

import java.util.UUID;

public class UserRegisteredEvent extends BasePlatformEvent {

    public UserRegisteredEvent(final UUID userId, final String email, final String role) {
        super(
            "USER_REGISTERED",
            userId,
            null,
            null,
            "AUTHENTICATION_MODULE",
            "{\"email\":\"" + email + "\",\"role\":\"" + role + "\"}"
        );
    }
}
