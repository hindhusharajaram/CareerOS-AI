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
@Table(name = "etl_execution_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "jobId")
public class EtlExecutionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "job_id")
    private UUID jobId;

    @Column(name = "pipeline_name", nullable = false)
    private String pipelineName;

    @Column(name = "pipeline_version", nullable = false)
    private String pipelineVersion;

    @Column(name = "records_extracted", nullable = false)
    private int recordsExtracted;

    @Column(name = "records_transformed", nullable = false)
    private int recordsTransformed;

    @Column(name = "records_loaded", nullable = false)
    private int recordsLoaded;

    @Column(name = "records_rejected", nullable = false)
    private int recordsRejected;

    @Column(name = "status", nullable = false)
    private String status; // SUCCESS, FAILED, RUNNING

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
