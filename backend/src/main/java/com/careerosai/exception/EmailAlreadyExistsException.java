package com.careerosai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an account registration attempt uses an already registered email address.
 */
public class EmailAlreadyExistsException extends DomainException {

    public EmailAlreadyExistsException(final String email) {
        super("Email address is already registered.", HttpStatus.CONFLICT, "USER_EMAIL_EXISTS");
    }
}
