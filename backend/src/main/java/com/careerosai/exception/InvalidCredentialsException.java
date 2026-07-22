package com.careerosai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when user authentication fails due to bad credentials.
 * Follows OWASP recommendations by returning generic error text.
 */
public class InvalidCredentialsException extends DomainException {

    public InvalidCredentialsException() {
        super("Invalid email or password.", HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS");
    }
}
