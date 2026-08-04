package com.careerosai.service;

import com.careerosai.dto.SectionHeatmapDto;

import java.util.List;

/**
 * Service for analyzing section presence and completeness across 10 standard resume sections.
 */
public interface ResumeHeatmapService {
    List<SectionHeatmapDto> generateHeatmap(String rawText);
}
