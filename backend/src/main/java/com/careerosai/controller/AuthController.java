package com.careerosai.controller;

import com.careerosai.dto.AuthResponse;
import com.careerosai.dto.CompanyRegisterRequest;
import com.careerosai.dto.LoginRequest;
import com.careerosai.dto.StudentRegisterRequest;
import com.careerosai.dto.UserSummaryDto;
import com.careerosai.observability.audit.AuditLogService;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.AuthService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing Authentication & Authorization Endpoints.
 * Thin orchestrator delegating all business logic to AuthService.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuditLogService auditLogService;

    /**
     * Register a new Student Account and Profile.
     */
    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<AuthResponse>> registerStudent(
        @Valid @RequestBody final StudentRegisterRequest request,
        final HttpServletRequest servletRequest
    ) {
        final AuthResponse authResponse = authService.registerStudent(request);
        auditLogService.logAction(authResponse.getUser().getId(), "STUDENT_REGISTER", "AUTH", "{\"email\":\"" + request.getEmail() + "\"}", servletRequest.getRemoteAddr());
        final ApiResponse<AuthResponse> response = ApiResponse.success(
            "Student account registered successfully.",
            authResponse,
            servletRequest.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Register a new Company Representative Account and Profile.
     */
    @PostMapping("/register/company")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCompany(
        @Valid @RequestBody final CompanyRegisterRequest request,
        final HttpServletRequest servletRequest
    ) {
        final AuthResponse authResponse = authService.registerCompany(request);
        auditLogService.logAction(authResponse.getUser().getId(), "COMPANY_REGISTER", "AUTH", "{\"companyName\":\"" + request.getCompanyName() + "\"}", servletRequest.getRemoteAddr());
        final ApiResponse<AuthResponse> response = ApiResponse.success(
            "Company account registered successfully.",
            authResponse,
            servletRequest.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Authenticate user credentials and issue JWT Access Token.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @Valid @RequestBody final LoginRequest request,
        final HttpServletRequest servletRequest
    ) {
        final AuthResponse authResponse = authService.login(request);
        auditLogService.logLogin(authResponse.getUser().getId(), request.getEmail(), servletRequest.getRemoteAddr());
        final ApiResponse<AuthResponse> response = ApiResponse.success(
            "User authenticated successfully.",
            authResponse,
            servletRequest.getRequestURI()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieve current authenticated user profile snapshot.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest servletRequest
    ) {
        final UserSummaryDto userSummary = authService.getCurrentUser(currentUser.getId());
        final ApiResponse<UserSummaryDto> response = ApiResponse.success(
            "Current user profile retrieved successfully.",
            userSummary,
            servletRequest.getRequestURI()
        );
        return ResponseEntity.ok(response);
    }
}
