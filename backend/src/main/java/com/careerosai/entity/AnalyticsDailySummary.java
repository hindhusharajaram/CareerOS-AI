package com.careerosai.entity;

import com.careerosai.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "analytics_daily_summary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false, of = "id")
public class AnalyticsDailySummary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @Column(name = "summary_date", nullable = false, unique = true)
    private LocalDate summaryDate;

    @Column(name = "dau", nullable = false)
    private int dau;

    @Column(name = "wau", nullable = false)
    private int wau;

    @Column(name = "mau", nullable = false)
    private int mau;

    @Column(name = "resume_upload_count", nullable = false)
    private int resumeUploadCount;

    @Column(name = "career_score_count", nullable = false)
    private int careerScoreCount;

    @Column(name = "recommendation_count", nullable = false)
    private int recommendationCount;

    @Column(name = "ai_usage_count", nullable = false)
    private int aiUsageCount;
}
