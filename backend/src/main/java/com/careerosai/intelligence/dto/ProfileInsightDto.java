package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileInsightDto {
    private List<String> topStrengths;
    private List<String> topWeaknesses;
    private List<String> priorityImprovements;
    private List<String> riskFactors;
    private List<String> missingItems;
    private String readinessLevel; // JOB_READY, PLACEMENT_READY, DEVELOPING, BEGINNER
}
