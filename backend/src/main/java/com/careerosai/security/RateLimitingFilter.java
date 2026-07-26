package com.careerosai.security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class RateLimitingFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 15;
    private static final long TIME_WINDOW_MS = 60_000L;

    private final Map<String, UserRequestTracker> requestTrackers = new ConcurrentHashMap<>();

    @Override
    public void doFilter(
        final ServletRequest request,
        final ServletResponse response,
        final FilterChain chain
    ) throws IOException, ServletException {

        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final HttpServletResponse httpResponse = (HttpServletResponse) response;

        final String uri = httpRequest.getRequestURI();

        // Target rate limiting specifically on authentication endpoints
        if (uri.contains("/auth/login") || uri.contains("/auth/register")) {
            final String clientIp = getClientIP(httpRequest);
            final long currentTime = System.currentTimeMillis();

            final UserRequestTracker tracker = requestTrackers.compute(clientIp, (ip, existingTracker) -> {
                if (existingTracker == null || (currentTime - existingTracker.startTimeMs) > TIME_WINDOW_MS) {
                    return new UserRequestTracker(currentTime, 1);
                } else {
                    existingTracker.count++;
                    return existingTracker;
                }
            });

            if (tracker.count > MAX_REQUESTS_PER_MINUTE) {
                log.warn("Rate limit exceeded for IP [{}] on [{}]", clientIp, uri);
                httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
                httpResponse.getWriter().write(
                    "{\"success\":false,\"message\":\"Too many authentication attempts. Please wait 1 minute before retrying.\",\"status\":429}"
                );
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private String getClientIP(final HttpServletRequest request) {
        final String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static class UserRequestTracker {
        final long startTimeMs;
        int count;

        UserRequestTracker(final long startTimeMs, final int count) {
            this.startTimeMs = startTimeMs;
            this.count = count;
        }
    }
}
