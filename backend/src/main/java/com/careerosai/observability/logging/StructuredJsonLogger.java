package com.careerosai.observability.logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Component
public class StructuredJsonLogger {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String buildJsonLog(
            final String level,
            final String message,
            final String loggerName,
            final Throwable throwable,
            final Map<String, Object> customAttributes
    ) {
        try {
            final Map<String, Object> logEntry = new LinkedHashMap<>();
            logEntry.put("timestamp", Instant.now().toString());
            logEntry.put("level", level);
            logEntry.put("logger", loggerName);
            logEntry.put("message", message);
            logEntry.put("traceId", MDC.get("traceId"));
            logEntry.put("spanId", MDC.get("spanId"));
            logEntry.put("correlationId", MDC.get("correlationId"));
            logEntry.put("requestId", MDC.get("requestId"));
            logEntry.put("userId", MDC.get("userId"));

            if (customAttributes != null && !customAttributes.isEmpty()) {
                logEntry.putAll(customAttributes);
            }

            if (throwable != null) {
                final StringWriter sw = new StringWriter();
                throwable.printStackTrace(new PrintWriter(sw));
                logEntry.put("exceptionClass", throwable.getClass().getName());
                logEntry.put("exceptionMessage", throwable.getMessage());
                logEntry.put("stackTrace", sw.toString());
            }

            return objectMapper.writeValueAsString(logEntry);
        } catch (Exception e) {
            return "{\"level\":\"ERROR\",\"message\":\"Failed to format JSON log\",\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    public void info(final String message, final Map<String, Object> attributes) {
        log.info(buildJsonLog("INFO", message, StructuredJsonLogger.class.getName(), null, attributes));
    }

    public void warn(final String message, final Map<String, Object> attributes) {
        log.warn(buildJsonLog("WARN", message, StructuredJsonLogger.class.getName(), null, attributes));
    }

    public void error(final String message, final Throwable throwable, final Map<String, Object> attributes) {
        log.error(buildJsonLog("ERROR", message, StructuredJsonLogger.class.getName(), throwable, attributes));
    }
}
