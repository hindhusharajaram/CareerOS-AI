package com.careerosai.repository;

import com.careerosai.entity.AnalyticsFeatureUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalyticsFeatureUsageRepository extends JpaRepository<AnalyticsFeatureUsage, UUID> {
    Optional<AnalyticsFeatureUsage> findByFeatureName(String featureName);
}
