package com.careerosai.repository;

import com.careerosai.entity.Role;
import com.careerosai.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Role Entity Persistence Operations.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find Role entity by RoleType enum name.
     */
    Optional<Role> findByName(RoleType name);

    /**
     * Check if a Role exists by RoleType enum name.
     */
    boolean existsByName(RoleType name);
}
