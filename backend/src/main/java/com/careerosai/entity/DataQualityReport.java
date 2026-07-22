package com.careerosai.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "data_quality_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "reportId")
public class DataQualityReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "report_id")
    private UUID reportId;

    @Column(name = "job_id")
    private UUID jobId;

    @Column(name = "total_assertions", nullable = false)
    private int totalAssertions;

    @Column(name = "passed_assertions", nullable = false)
    private int passedAssertions;

    @Column(name = "failed_assertions", nullable = false)
    private int failedAssertions;

    @Column(name = "quality_score", nullable = false)
    private int qualityScore;

    @Column(name = "report_json", nullable = false, columnDefinition = "TEXT")
    private String reportJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
