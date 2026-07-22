package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerGoalDto {
    private UUID id;
    private UUID studentId;
    private String preferredRole;
    private String preferredDomain;
    private String preferredLocation;
    private BigDecimal expectedSalary;
    private Boolean higherStudies;
    private String targetCompanies;
    private String workMode; // REMOTE, HYBRID, ONSITE
}
