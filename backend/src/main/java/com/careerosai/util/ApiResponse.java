package com.careerosai.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Standardized Unified JSON API Response Envelope used across all REST Endpoints.
 *
 * @param <T> Type of response payload
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Instant timestamp;
    private String path;
    private int status;

    /**
     * Helper to construct a successful ApiResponse payload.
     */
    public static <T> ApiResponse<T> success(final String message, final T data, final String path) {
        return ApiResponse.<T>builder()
            .success(true)
            .message(message)
            .data(data)
            .timestamp(Instant.now())
            .path(path)
            .status(200)
            .build();
    }

    /**
     * Helper to construct an error ApiResponse payload.
     */
    public static <T> ApiResponse<T> error(final String message, final int status, final String path) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .data(null)
            .timestamp(Instant.now())
            .path(path)
            .status(status)
            .build();
    }
}
