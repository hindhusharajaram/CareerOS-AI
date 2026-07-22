package com.careerosai.repository;

import com.careerosai.entity.StudentSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for StudentSkill Persistence.
 */
@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, UUID> {

    List<StudentSkill> findByStudentProfileId(UUID studentProfileId);

    Optional<StudentSkill> findByStudentProfileIdAndSkillId(UUID studentProfileId, UUID skillId);

    boolean existsByStudentProfileIdAndSkillId(UUID studentProfileId, UUID skillId);

    void deleteByStudentProfileIdAndSkillId(UUID studentProfileId, UUID skillId);

    long countByStudentProfileId(UUID studentProfileId);
}
