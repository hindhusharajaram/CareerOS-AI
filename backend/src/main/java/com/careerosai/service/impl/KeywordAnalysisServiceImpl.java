package com.careerosai.service.impl;

import com.careerosai.dto.KeywordAnalysisDto;
import com.careerosai.service.KeywordAnalysisService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Implementation of KeywordAnalysisService.
 */
@Service
public class KeywordAnalysisServiceImpl implements KeywordAnalysisService {

    private static final List<String> SWE_KEYWORDS_TAXONOMY = Arrays.asList(
        "Java", "Spring Boot", "React", "TypeScript", "JavaScript", "Docker",
        "AWS", "SQL", "Git", "CI/CD", "Microservices", "REST API", "Linux",
        "JUnit", "Redis", "GraphQL", "Node.js", "System Design", "Data Structures",
        "Algorithms", "OOP", "Spring Security", "PostgreSQL", "Kubernetes", "HTML", "CSS"
    );

    @Override
    public KeywordAnalysisDto analyzeKeywords(final String rawText) {
        final List<String> matchedKeywords = new ArrayList<>();
        final List<String> missingKeywords = new ArrayList<>();
        final String text = rawText != null ? rawText : "";

        for (String keyword : SWE_KEYWORDS_TAXONOMY) {
            final String regex = "\\b" + Pattern.quote(keyword) + "\\b";
            if (Pattern.compile(regex, Pattern.CASE_INSENSITIVE).matcher(text).find()) {
                matchedKeywords.add(keyword);
            } else {
                missingKeywords.add(keyword);
            }
        }

        final double coveragePercentage = Math.round(((double) matchedKeywords.size() / (double) SWE_KEYWORDS_TAXONOMY.size()) * 100.0 * 10.0) / 10.0;

        return KeywordAnalysisDto.builder()
            .matchedKeywords(matchedKeywords)
            .missingKeywords(missingKeywords)
            .coveragePercentage(coveragePercentage)
            .build();
    }
}
