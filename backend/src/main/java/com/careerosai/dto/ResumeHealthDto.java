package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing overall Resume Health metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeHealthDto {
    private int score;
    private String label;
    private String stars;
    private String percentile;
    private String readinessStatus;
}
