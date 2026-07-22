package com.careerosai.repository;

import com.careerosai.entity.AnalyticsFailure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AnalyticsFailureRepository extends JpaRepository<AnalyticsFailure, UUID> {
}
