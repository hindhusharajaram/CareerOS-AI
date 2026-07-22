package com.careerosai.security;

import com.careerosai.util.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handles access denied scenarios by returning a standardized JSON ApiResponse with HTTP 403.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(
        final HttpServletRequest request,
        final HttpServletResponse response,
        final AccessDeniedException accessDeniedException
    ) throws IOException {
        log.warn("Forbidden access attempt to URI: {}", request.getRequestURI());

        final ApiResponse<Void> errorResponse = ApiResponse.error(
            "Access denied. You do not have sufficient permissions to access this resource.",
            HttpStatus.FORBIDDEN.value(),
            request.getRequestURI()
        );

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
