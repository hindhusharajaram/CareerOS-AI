package com.careerosai.repository;

import com.careerosai.entity.CompanyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for CompanyProfile Entity Persistence Operations.
 */
@Repository
public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID> {

    /**
     * Find Company Profile by owner User ID.
     */
    Optional<CompanyProfile> findByUserId(UUID userId);

    /**
     * Find Company Profile by unique Company Name.
     */
    Optional<CompanyProfile> findByCompanyName(String companyName);

    /**
     * Check if a Company Profile exists for the given User ID.
     */
    boolean existsByUserId(UUID userId);

    /**
     * Check if a Company Profile exists with the given Company Name.
     */
    boolean existsByCompanyName(String companyName);
}
