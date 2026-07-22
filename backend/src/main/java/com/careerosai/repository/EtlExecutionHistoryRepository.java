package com.careerosai.repository;

import com.careerosai.entity.EtlExecutionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EtlExecutionHistoryRepository extends JpaRepository<EtlExecutionHistory, UUID> {
}
