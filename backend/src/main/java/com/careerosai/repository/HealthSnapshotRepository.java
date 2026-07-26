package com.careerosai.repository;

import com.careerosai.entity.HealthSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthSnapshotRepository extends JpaRepository<HealthSnapshot, UUID> {
    List<HealthSnapshot> findTop10ByOrderByCreatedAtDesc();
}
