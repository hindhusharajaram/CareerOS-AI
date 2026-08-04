package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing category-by-category ATS evaluation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsCategoryScoreDto {
    private String category;
    private int currentScore;
    private int maxScore;
    private String explanation;
}
