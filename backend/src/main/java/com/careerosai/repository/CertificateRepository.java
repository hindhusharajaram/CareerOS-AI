package com.careerosai.repository;

import com.careerosai.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Spring Data JPA Repository for Certificate Persistence.
 */
@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {

    List<Certificate> findByStudentProfileId(UUID studentProfileId);

    long countByStudentProfileId(UUID studentProfileId);
}
