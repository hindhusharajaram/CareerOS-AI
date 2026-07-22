package com.careerosai.repository;

import com.careerosai.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for StudentProfile Entity Persistence Operations.
 */
@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, UUID> {

    /**
     * Find Student Profile by owner User ID.
     */
    Optional<StudentProfile> findByUserId(UUID userId);

    /**
     * Check if a Student Profile exists for the given User ID.
     */
    boolean existsByUserId(UUID userId);
}
