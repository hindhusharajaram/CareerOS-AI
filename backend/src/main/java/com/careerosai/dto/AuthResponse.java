package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object returned upon successful User authentication or registration.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private long expiresInMs;
    private UserSummaryDto user;
}
