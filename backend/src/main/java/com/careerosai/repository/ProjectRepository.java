package com.careerosai.repository;

import com.careerosai.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Project Persistence.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByStudentProfileId(UUID studentProfileId);

    long countByStudentProfileId(UUID studentProfileId);
}
