package com.careerosai.repository;

import com.careerosai.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Education Persistence.
 */
@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {

    List<Education> findByStudentProfileIdOrderByStartYearDesc(UUID studentProfileId);

    long countByStudentProfileId(UUID studentProfileId);
}
