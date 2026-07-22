package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsScoreDto {
    private int atsScore; // 0 - 100
    private Map<String, Boolean> sectionCompleteness;
    private double keywordDensityScore;
    private List<String> suggestions;
    private List<String> missingSections;
}
