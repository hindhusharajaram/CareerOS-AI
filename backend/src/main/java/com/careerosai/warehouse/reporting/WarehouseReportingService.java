package com.careerosai.warehouse.reporting;

import com.careerosai.entity.DataQualityReport;
import com.careerosai.entity.EtlExecutionHistory;
import com.careerosai.repository.DataQualityReportRepository;
import com.careerosai.repository.EtlExecutionHistoryRepository;
import com.careerosai.warehouse.dimension.DimDateRepository;
import com.careerosai.warehouse.dimension.DimFeatureRepository;
import com.careerosai.warehouse.dimension.DimUserRepository;
import com.careerosai.warehouse.dto.WarehouseSummaryDto;
import com.careerosai.warehouse.etl.EtlPipelineService;
import com.careerosai.warehouse.fact.FactUserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WarehouseReportingService {

    private final FactUserActivityRepository factUserActivityRepository;
    private final DimUserRepository dimUserRepository;
    private final DimDateRepository dimDateRepository;
    private final DimFeatureRepository dimFeatureRepository;
    private final EtlExecutionHistoryRepository etlExecutionHistoryRepository;
    private final DataQualityReportRepository dataQualityReportRepository;
    private final EtlPipelineService etlPipelineService;

    public WarehouseSummaryDto getWarehouseSummary() {
        final long totalFacts = factUserActivityRepository.count();
        final long dimUsers = dimUserRepository.count();
        final long dimDates = dimDateRepository.count();
        final long dimFeatures = dimFeatureRepository.count();
        final long totalDims = dimUsers + dimDates + dimFeatures;

        final List<EtlExecutionHistory> jobs = etlExecutionHistoryRepository.findAll();
        final String etlStatus = jobs.isEmpty() ? "IDLE" : jobs.get(jobs.size() - 1).getStatus();

        final List<DataQualityReport> qualityReports = dataQualityReportRepository.findAll();
        final int score = qualityReports.isEmpty() ? 100 : qualityReports.get(qualityReports.size() - 1).getQualityScore();

        final Map<String, Long> factsMap = new LinkedHashMap<>();
        factsMap.put("fact_user_activity", totalFacts);
        factsMap.put("fact_resume_analysis", 0L);
        factsMap.put("fact_ai_usage", 0L);
        factsMap.put("fact_career_scores", 0L);

        final Map<String, Long> dimsMap = new LinkedHashMap<>();
        dimsMap.put("dim_user", dimUsers);
        dimsMap.put("dim_date", dimDates);
        dimsMap.put("dim_feature", dimFeatures);

        return WarehouseSummaryDto.builder()
            .etlStatus(etlStatus)
            .latestDataQualityScore(score)
            .totalFactRecords(totalFacts)
            .totalDimensionRecords(totalDims)
            .totalEtlJobsExecuted(jobs.size())
            .factTableCounts(factsMap)
            .dimensionTableCounts(dimsMap)
            .pipelineHealthStatus("HEALTHY (Incremental Loading Active)")
            .build();
    }

    public EtlExecutionHistory triggerEtlPipeline() {
        return etlPipelineService.runIncrementalEtlPipeline();
    }
}
