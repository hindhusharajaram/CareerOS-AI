package com.careerosai.exception;

import com.careerosai.dto.ValidationErrorDetail;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller Advice centralizing exception handling across all REST controllers.
 * Converts domain exceptions, validation failures, and security errors into unified ApiResponse objects.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle custom domain exceptions.
     */
    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiResponse<Void>> handleDomainException(
        final DomainException ex,
        final HttpServletRequest request
    ) {
        log.warn("Domain exception [{}]: {} at URI {}", ex.getErrorCode(), ex.getMessage(), request.getRequestURI());

        final ApiResponse<Void> response = ApiResponse.error(
            ex.getMessage(),
            ex.getStatus().value(),
            request.getRequestURI()
        );

        return new ResponseEntity<>(response, ex.getStatus());
    }

    /**
     * Handle Jakarta Bean Validation errors (@Valid).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<List<ValidationErrorDetail>>> handleValidationException(
        final MethodArgumentNotValidException ex,
        final HttpServletRequest request
    ) {
        log.warn("Validation failed for request to URI: {}", request.getRequestURI());

        final List<ValidationErrorDetail> validationErrors = ex.getBindingResult().getAllErrors().stream()
            .map(error -> {
                final String fieldName = (error instanceof FieldError) ? ((FieldError) error).getField() : error.getObjectName();
                final Object rejectedValue = (error instanceof FieldError) ? ((FieldError) error).getRejectedValue() : null;
                return ValidationErrorDetail.builder()
                    .field(fieldName)
                    .rejectedValue(rejectedValue)
                    .message(error.getDefaultMessage())
                    .build();
            })
            .collect(Collectors.toList());

        final ApiResponse<List<ValidationErrorDetail>> response = ApiResponse.<List<ValidationErrorDetail>>builder()
            .success(false)
            .message("Validation failed for one or more fields.")
            .data(validationErrors)
            .timestamp(java.time.Instant.now())
            .path(request.getRequestURI())
            .status(HttpStatus.BAD_REQUEST.value())
            .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle Spring Security BadCredentialsException.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
        final BadCredentialsException ex,
        final HttpServletRequest request
    ) {
        log.warn("Authentication failed: invalid credentials at URI {}", request.getRequestURI());

        final ApiResponse<Void> response = ApiResponse.error(
            "Invalid email or password.",
            HttpStatus.UNAUTHORIZED.value(),
            request.getRequestURI()
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle Spring Security AccessDeniedException.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
        final AccessDeniedException ex,
        final HttpServletRequest request
    ) {
        log.warn("Forbidden access attempt at URI {}", request.getRequestURI());

        final ApiResponse<Void> response = ApiResponse.error(
            "Access denied. Insufficient permissions.",
            HttpStatus.FORBIDDEN.value(),
            request.getRequestURI()
        );

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * Fallback handler for unhandled internal server exceptions.
     * Prevents internal implementation leak to external clients.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(
        final Exception ex,
        final HttpServletRequest request
    ) {
        log.error("Unhandled internal server exception at URI {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        final ApiResponse<Void> response = ApiResponse.error(
            "An unexpected internal server error occurred. Please contact system support.",
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            request.getRequestURI()
        );

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
