package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing resume section presence status.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionHeatmapDto {
    private String section;
    private String status; // "Present", "Partial", "Missing"
    private String details;
}
