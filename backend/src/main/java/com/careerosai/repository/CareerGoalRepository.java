package com.careerosai.repository;

import com.careerosai.entity.CareerGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for CareerGoal Persistence.
 */
@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoal, UUID> {

    Optional<CareerGoal> findByStudentProfileId(UUID studentProfileId);

    boolean existsByStudentProfileId(UUID studentProfileId);
}
