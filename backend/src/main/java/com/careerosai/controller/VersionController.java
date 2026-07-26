package com.careerosai.controller;

import com.careerosai.dto.VersionInfoDto;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/version")
public class VersionController {

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    @GetMapping
    public ResponseEntity<ApiResponse<VersionInfoDto>> getVersionInfo(final HttpServletRequest request) {
        final VersionInfoDto info = VersionInfoDto.builder()
            .version("1.0.0")
            .releaseName("CareerOS AI Production Engineering Release v1.0.0")
            .buildTimestamp(Instant.now().toString())
            .commitHash("349e52e9f0857ba8d499e9b6834feebc59a06adf")
            .environment(activeProfile)
            .enabledModules(List.of(
                "Sprint 1: Core User & Student Profile Domain",
                "Sprint 2: Master Skill Taxonomy & Resume Management",
                "Sprint 3: AI Resume Analyzer & ATS Scoring Engine",
                "Sprint 4: Event-Driven Analytics & Usage Tracking",
                "Sprint 5: Analytics Warehouse & Star Schema ETL",
                "Sprint 6.1: Grounded AI Career Assistant",
                "Sprint 6.2: Grounded AI Career Assistant Extensions",
                "Sprint 6.3: Observability & Production Monitoring Platform",
                "Sprint 6.4: Containerization & Cloud-Native Foundation",
                "Sprint 6.5: CI/CD, Security Hardening & Production Release Platform"
            ))
            .build();

        return ResponseEntity.ok(ApiResponse.success("Version metadata retrieved", info, request.getRequestURI()));
    }
}
