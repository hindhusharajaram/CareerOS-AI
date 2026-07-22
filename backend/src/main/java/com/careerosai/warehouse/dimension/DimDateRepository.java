package com.careerosai.warehouse.dimension;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DimDateRepository extends JpaRepository<DimDate, Integer> {
    Optional<DimDate> findByDateKey(Integer dateKey);
}
