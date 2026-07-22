package com.careerosai.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a company registration attempt uses an already registered company name.
 */
public class CompanyAlreadyExistsException extends DomainException {

    public CompanyAlreadyExistsException(final String companyName) {
        super("Company name is already registered.", HttpStatus.CONFLICT, "COMPANY_NAME_EXISTS");
    }
}
