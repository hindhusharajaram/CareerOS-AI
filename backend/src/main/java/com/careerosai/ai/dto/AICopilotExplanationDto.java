package com.careerosai.ai.dto;

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
public class AICopilotExplanationDto {
    private String topic; // CAREER_SCORE, ATS_SCORE, SKILL_GAP, ELIGIBILITY, RECOMMENDATIONS, ROADMAP
    private String explanationText;
    private List<String> keyTakeaways;
    private List<String> immediateActionItems;
    private String groundedContextSummary;
}
