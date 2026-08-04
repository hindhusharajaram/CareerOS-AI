package com.careerosai.service;

import com.careerosai.dto.QuantificationBulletDto;

import java.util.List;

/**
 * Service for auditing resume bullet points for quantitative impact metrics and generating placeholder suggestions.
 */
public interface QuantificationDetectorService {
    List<QuantificationBulletDto> detectQuantification(String rawText);
}
