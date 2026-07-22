package com.careerosai.warehouse.fact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FactUserActivityRepository extends JpaRepository<FactUserActivity, UUID> {
}
