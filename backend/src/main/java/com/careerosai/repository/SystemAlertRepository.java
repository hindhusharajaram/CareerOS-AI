package com.careerosai.repository;

import com.careerosai.entity.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, UUID> {
    List<SystemAlert> findTop20ByOrderByCreatedAtDesc();
}
