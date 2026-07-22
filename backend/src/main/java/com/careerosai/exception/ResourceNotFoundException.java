package com.careerosai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested domain entity cannot be located.
 */
public class ResourceNotFoundException extends DomainException {

    public ResourceNotFoundException(final String resourceName, final String fieldName, final Object fieldValue) {
        super(
            String.format("%s not found with %s: '%s'", resourceName, fieldName, fieldValue),
            HttpStatus.NOT_FOUND,
            "RESOURCE_NOT_FOUND"
        );
    }
}
