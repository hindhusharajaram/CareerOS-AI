package com.careerosai.controller;

import com.careerosai.dto.AuthResponse;
import com.careerosai.dto.LoginRequest;
import com.careerosai.dto.RegisterRequest;
import com.careerosai.observability.audit.AuditLogService;
import com.careerosai.service.AuthService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller exposing simple Authentication & Authorization Endpoints.
 * Bypasses detailed profile fields to provide quick signup and login capabilities.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthSimpleController {

    private final AuthService authService;
    private final AuditLogService auditLogService;

    /**
     * Register a new User Account.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
        @Valid @RequestBody final RegisterRequest request,
        final HttpServletRequest servletRequest
    ) {
        final AuthResponse authResponse = authService.register(request);
        auditLogService.logAction(authResponse.getUser().getId(), "USER_REGISTER", "AUTH", "{\"email\":\"" + request.getEmail() + "\"}", servletRequest.getRemoteAddr());
        final ApiResponse<AuthResponse> response = ApiResponse.success(
            "User registered successfully.",
            authResponse,
            servletRequest.getRequestURI()
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Authenticate user credentials and return a token.
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
}
