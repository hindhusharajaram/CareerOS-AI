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
public class EligibilityReportDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyEligibility {
        private String companyName;
        private String programName;
        private String status; // ELIGIBLE, NEARLY_ELIGIBLE, NOT_ELIGIBLE
        private String explanation;
        private List<String> metCriteria;
        private List<String> missingCriteria;
    }

    private List<CompanyEligibility> evaluations;
}
