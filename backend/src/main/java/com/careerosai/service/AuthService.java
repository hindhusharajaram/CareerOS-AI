package com.careerosai.service;

import com.careerosai.dto.AuthResponse;
import com.careerosai.dto.CompanyRegisterRequest;
import com.careerosai.dto.LoginRequest;
import com.careerosai.dto.RegisterRequest;
import com.careerosai.dto.StudentRegisterRequest;
import com.careerosai.dto.UserSummaryDto;

import java.util.UUID;

/**
 * Service Interface managing Authentication and User Profile operations.
 */
public interface AuthService {

    /**
     * Registers a new User account.
     *
     * @param request General registration details
     * @return AuthResponse containing token and user summary
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Registers a new Student account and creates associated StudentProfile.
     *
     * @param request Student registration details
     * @return AuthResponse containing token and user summary
     */
    AuthResponse registerStudent(StudentRegisterRequest request);

    /**
     * Registers a new Company account and creates associated CompanyProfile.
     *
     * @param request Company registration details
     * @return AuthResponse containing token and user summary
     */
    AuthResponse registerCompany(CompanyRegisterRequest request);

    /**
     * Authenticates User credentials and issues JWT Access Token.
     *
     * @param request Login credentials (email & password)
     * @return AuthResponse containing token and user summary
     */
    AuthResponse login(LoginRequest request);

    /**
     * Retrieves currently authenticated user profile snapshot.
     *
     * @param userId Authenticated user UUID
     * @return UserSummaryDto containing user profile and role details
     */
    UserSummaryDto getCurrentUser(UUID userId);
}
