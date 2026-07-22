package com.careerosai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an authenticated user attempts an operation outside their security permissions.
 */
public class UnauthorizedOperationException extends DomainException {

    public UnauthorizedOperationException(final String message) {
        super(message, HttpStatus.FORBIDDEN, "UNAUTHORIZED_OPERATION");
    }
}
