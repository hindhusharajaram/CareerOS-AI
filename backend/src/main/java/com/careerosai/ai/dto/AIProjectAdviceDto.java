package com.careerosai.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIProjectAdviceDto {
    private UUID projectId;
    private String projectTitle;
    private List<String> architectureImprovements;
    private List<String> technologyUpgrades;
    private List<String> cloudImprovements;
    private List<String> securityImprovements;
    private List<String> databaseImprovements;
    private List<String> scalabilityImprovements;
    private List<String> deploymentImprovements;
}
