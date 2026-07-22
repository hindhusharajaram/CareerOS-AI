package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

/**
 * Data Transfer Object representing authenticated User profile snapshot.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {

    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private Set<String> roles;
    private String profileType; // STUDENT, COMPANY, ADMIN
    private Object profileDetails; // StudentProfile or CompanyProfile snapshot
}
