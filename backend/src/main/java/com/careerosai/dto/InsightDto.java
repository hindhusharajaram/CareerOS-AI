package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing priority-categorized actionable resume recommendation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsightDto {
    private String category;
    private String description;
    private String priority; // "HIGH", "MEDIUM", "LOW"
}
