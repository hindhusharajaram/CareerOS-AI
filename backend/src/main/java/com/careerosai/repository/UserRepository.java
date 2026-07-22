package com.careerosai.repository;

import com.careerosai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Spring Data JPA Repository for User Entity Persistence Operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by unique email address (includes soft-deleted accounts).
     */
    Optional<User> findByEmail(String email);

    /**
     * Find active user by email address excluding soft-deleted accounts.
     */
    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    /**
     * Check if a user exists with the given email address.
     */
    boolean existsByEmail(String email);

    /**
     * Check if an active user exists with the given email address.
     */
    boolean existsByEmailAndDeletedAtIsNull(String email);
}
