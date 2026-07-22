package com.careerosai.repository;

import com.careerosai.entity.AIChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AIChatSessionRepository extends JpaRepository<AIChatSession, UUID> {
    List<AIChatSession> findByStudentProfileIdOrderByCreatedAtDesc(UUID studentProfileId);
}
