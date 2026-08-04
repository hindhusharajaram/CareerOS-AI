package com.careerosai.service;

import com.careerosai.dto.KeywordAnalysisDto;

/**
 * Service for analyzing Software Engineering keyword taxonomy matching.
 */
public interface KeywordAnalysisService {
    KeywordAnalysisDto analyzeKeywords(String rawText);
}
