package com.careerosai.warehouse.scheduler;

import com.careerosai.warehouse.etl.EtlPipelineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WarehouseScheduler {

    private final EtlPipelineService etlPipelineService;

    @Scheduled(fixedRate = 300000) // Runs every 5 minutes
    public void scheduleHourlyIncrementalEtl() {
        log.info("Warehouse Scheduler: Executing Scheduled Incremental ETL Pipeline...");
        try {
            etlPipelineService.runIncrementalEtlPipeline();
        } catch (Exception e) {
            log.error("Warehouse Scheduler ETL execution failed: {}", e.getMessage(), e);
        }
    }
}
