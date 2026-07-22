package com.careerosai.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base Abstract Domain Exception for all CareerOS AI business rule violations.
 */
@Getter
public abstract class DomainException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    protected DomainException(final String message, final HttpStatus status, final String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}
