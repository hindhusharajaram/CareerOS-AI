package com.careerosai.repository;

import com.careerosai.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Skill Entity Persistence.
 */
@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {

    Optional<Skill> findBySkillNameIgnoreCase(String skillName);

    List<Skill> findByCategoryIgnoreCase(String category);

    List<Skill> findBySkillNameContainingIgnoreCase(String query);
}
