package com.careerosai.service;

import com.careerosai.dto.AtsCategoryScoreDto;

import java.util.List;

/**
 * Service for computing deterministic ATS score categories and detailed explanations.
 */
public interface ATSScoreService {
    List<AtsCategoryScoreDto> evaluateCategories(String rawText);

    int calculateTotalScore(List<AtsCategoryScoreDto> categories);
}
