package com.careerosai.repository;

import com.careerosai.entity.MasterSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MasterSkillRepository extends JpaRepository<MasterSkill, UUID> {

    Optional<MasterSkill> findByNameIgnoreCase(String name);
}
