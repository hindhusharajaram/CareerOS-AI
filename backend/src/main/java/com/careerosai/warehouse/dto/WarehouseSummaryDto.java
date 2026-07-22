package com.careerosai.warehouse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WarehouseSummaryDto {
    private String etlStatus;
    private int latestDataQualityScore;
    private long totalFactRecords;
    private long totalDimensionRecords;
    private long totalEtlJobsExecuted;
    private Map<String, Long> factTableCounts;
    private Map<String, Long> dimensionTableCounts;
    private String pipelineHealthStatus;
}
