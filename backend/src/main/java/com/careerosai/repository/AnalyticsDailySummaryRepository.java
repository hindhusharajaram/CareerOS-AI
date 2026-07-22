package com.careerosai.repository;

import com.careerosai.entity.AnalyticsDailySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalyticsDailySummaryRepository extends JpaRepository<AnalyticsDailySummary, UUID> {
    Optional<AnalyticsDailySummary> findBySummaryDate(LocalDate summaryDate);
}
