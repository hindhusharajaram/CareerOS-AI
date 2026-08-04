package com.careerosai.service.impl;

import com.careerosai.dto.QuantificationBulletDto;
import com.careerosai.service.QuantificationDetectorService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Implementation of QuantificationDetectorService.
 * Scans bullet points for metrics and generates template-driven suggestions with placeholders (XX+, YY%, ZZ users, NN countries, MM requests, TT ms).
 */
@Service
public class QuantificationDetectorServiceImpl implements QuantificationDetectorService {

    private static final Pattern METRIC_PATTERN = Pattern.compile(
        "(%|\\$|₹|\\+|\\b\\d+\\b|\\b(users|countries|requests|latency|performance|revenue|time|milliseconds|ms|seconds|hours|mb|gb|tb|rows|records|apis?)\\b)",
        Pattern.CASE_INSENSITIVE
    );

    @Override
    public List<QuantificationBulletDto> detectQuantification(final String rawText) {
        final List<QuantificationBulletDto> results = new ArrayList<>();
        if (rawText == null || rawText.isBlank()) return results;

        final String[] lines = rawText.split("\\r?\\n");
        for (String line : lines) {
            final String trimmed = line.trim().replaceAll("^[•\\-*\\s]+", "");
            // Filter lines: ignore short section headers or non-bullet headers (< 15 chars)
            if (trimmed.length() < 15 || isSectionHeader(trimmed)) continue;

            final boolean isQuantified = METRIC_PATTERN.matcher(trimmed).find();
            final String status = isQuantified ? "Quantified" : "Needs Quantification";
            final String suggestion = isQuantified
                ? "Great job! This statement contains measurable metric impact."
                : generatePlaceholderSuggestion(trimmed);

            results.add(QuantificationBulletDto.builder()
                .currentBullet(trimmed)
                .status(status)
                .suggestion(suggestion)
                .build());

            // Limit output to top 10 relevant bullet points for clean UX
            if (results.size() >= 10) break;
        }

        return results;
    }

    private boolean isSectionHeader(final String line) {
        final String lower = line.toLowerCase();
        return lower.equals("education") || lower.equals("experience") || lower.equals("projects")
            || lower.equals("skills") || lower.equals("certifications") || lower.equals("summary");
    }

    private String generatePlaceholderSuggestion(final String bullet) {
        final String lower = bullet.toLowerCase();
        if (lower.contains("api") || lower.contains("rest") || lower.contains("endpoint")) {
            return "Example: " + bullet + " supporting secure JWT authentication and handling MM+ daily requests.";
        }
        if (lower.contains("dashboard") || lower.contains("frontend") || lower.contains("ui") || lower.contains("app")) {
            return "Example: " + bullet + " analyzing metrics for ZZ+ active users across NN countries.";
        }
        if (lower.contains("database") || lower.contains("sql") || lower.contains("query") || lower.contains("postgres")) {
            return "Example: " + bullet + " reducing p99 query latency by YY% across RR+ database records.";
        }
        if (lower.contains("pipeline") || lower.contains("ci/cd") || lower.contains("docker") || lower.contains("deploy")) {
            return "Example: " + bullet + " reducing build and deployment time by YY% (TT ms latency).";
        }
        return "Example: Add measurable impact. " + bullet + " improving efficiency by YY% across ZZ+ users.";
    }
}
