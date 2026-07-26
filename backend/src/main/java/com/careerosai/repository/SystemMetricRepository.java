package com.careerosai.repository;

import com.careerosai.entity.SystemMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SystemMetricRepository extends JpaRepository<SystemMetric, UUID> {
    List<SystemMetric> findTop50ByOrderByCreatedAtDesc();
    List<SystemMetric> findTop20ByMetricNameOrderByCreatedAtDesc(String metricName);
}
