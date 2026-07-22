package com.careerosai.repository;

import com.careerosai.entity.SkillAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillAliasRepository extends JpaRepository<SkillAlias, UUID> {

    Optional<SkillAlias> findByAliasIgnoreCase(String alias);
}
