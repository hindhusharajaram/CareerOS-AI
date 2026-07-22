package com.careerosai.warehouse.dimension;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DimFeatureRepository extends JpaRepository<DimFeature, UUID> {
    Optional<DimFeature> findByFeatureName(String featureName);
}
