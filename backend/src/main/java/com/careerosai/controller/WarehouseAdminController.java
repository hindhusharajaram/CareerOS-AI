package com.careerosai.controller;

import com.careerosai.entity.EtlExecutionHistory;
import com.careerosai.util.ApiResponse;
import com.careerosai.warehouse.dto.WarehouseSummaryDto;
import com.careerosai.warehouse.reporting.WarehouseReportingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/warehouse")
@RequiredArgsConstructor
public class WarehouseAdminController {

    private final WarehouseReportingService warehouseReportingService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<WarehouseSummaryDto>> getSummary(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Warehouse summary retrieved", warehouseReportingService.getWarehouseSummary(), request.getRequestURI()));
    }

    @PostMapping("/etl/trigger")
    public ResponseEntity<ApiResponse<EtlExecutionHistory>> triggerEtl(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("ETL Pipeline Execution Triggered", warehouseReportingService.triggerEtlPipeline(), request.getRequestURI()));
    }
}
