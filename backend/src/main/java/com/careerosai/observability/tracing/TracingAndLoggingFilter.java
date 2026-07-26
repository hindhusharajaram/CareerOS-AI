package com.careerosai.observability.tracing;

import com.careerosai.observability.alerts.SystemAlertService;
import com.careerosai.observability.logging.StructuredJsonLogger;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class TracingAndLoggingFilter implements Filter {

    public static final String TRACE_ID = "traceId";
    public static final String SPAN_ID = "spanId";
    public static final String CORRELATION_ID = "correlationId";
    public static final String REQUEST_ID = "requestId";
    public static final String USER_ID = "userId";

    private final SystemAlertService systemAlertService;

    @Override
    public void doFilter(
        final ServletRequest request,
        final ServletResponse response,
        final FilterChain chain
    ) throws IOException, ServletException {

        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Tracing Propagation & Generation
        final String traceId = httpRequest.getHeader("X-Trace-Id") != null
            ? httpRequest.getHeader("X-Trace-Id")
            : UUID.randomUUID().toString();
        final String spanId = UUID.randomUUID().toString().substring(0, 8);
        final String correlationId = httpRequest.getHeader("X-Correlation-Id") != null
            ? httpRequest.getHeader("X-Correlation-Id")
            : UUID.randomUUID().toString();
        final String requestId = UUID.randomUUID().toString().substring(0, 12);

        // Security context extraction for userId
        String userId = "anonymous";
        final Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            userId = auth.getName();
        }

        MDC.put(TRACE_ID, traceId);
        MDC.put(SPAN_ID, spanId);
        MDC.put(CORRELATION_ID, correlationId);
        MDC.put(REQUEST_ID, requestId);
        MDC.put(USER_ID, userId);

        httpResponse.setHeader("X-Trace-Id", traceId);
        httpResponse.setHeader("X-Span-Id", spanId);
        httpResponse.setHeader("X-Correlation-Id", correlationId);

        final long startTime = System.currentTimeMillis();

        try {
            chain.doFilter(request, response);
        } finally {
            final long duration = System.currentTimeMillis() - startTime;
            final int status = httpResponse.getStatus();

            final Map<String, Object> logAttr = new LinkedHashMap<>();
            logAttr.put("method", httpRequest.getMethod());
            logAttr.put("uri", httpRequest.getRequestURI());
            logAttr.put("status", status);
            logAttr.put("executionTimeMs", duration);

            final String jsonLog = StructuredJsonLogger.buildJsonLog(
                status >= 500 ? "ERROR" : status >= 400 ? "WARN" : "INFO",
                "HTTP Request Processed",
                TracingAndLoggingFilter.class.getName(),
                null,
                logAttr
            );
            log.info(jsonLog);

            // Alert engine check for High Latency (> 2000 ms)
            if (duration > 2000) {
                systemAlertService.createAlert(
                    "WARNING",
                    "HTTP_LATENCY",
                    "High latency detected on [" + httpRequest.getMethod() + " " + httpRequest.getRequestURI() + "]: " + duration + " ms"
                );
            }

            MDC.clear();
        }
    }
}
