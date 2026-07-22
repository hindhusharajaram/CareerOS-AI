package com.careerosai.repository;

import com.careerosai.entity.DataQualityReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DataQualityReportRepository extends JpaRepository<DataQualityReport, UUID> {
}
