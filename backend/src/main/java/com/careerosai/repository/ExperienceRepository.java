package com.careerosai.repository;

import com.careerosai.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Experience Persistence.
 */
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    List<Experience> findByStudentProfileId(UUID studentProfileId);

    long countByStudentProfileId(UUID studentProfileId);
}
