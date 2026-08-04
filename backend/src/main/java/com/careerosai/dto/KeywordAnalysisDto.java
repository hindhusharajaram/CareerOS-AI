package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO representing Software Engineering taxonomy keyword matching results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeywordAnalysisDto {
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private double coveragePercentage;
}
