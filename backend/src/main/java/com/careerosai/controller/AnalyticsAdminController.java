package com.careerosai.controller;

import com.careerosai.analytics.dto.AnalyticsSummaryDto;
import com.careerosai.analytics.service.AnalyticsEngineService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsAdminController {

    private final AnalyticsEngineService analyticsEngineService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getSummary(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Analytics summary retrieved", analyticsEngineService.getSummaryReport(), request.getRequestURI()));
    }
}
