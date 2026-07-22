package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing field-level Jakarta validation failures.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorDetail {

    private String field;
    private Object rejectedValue;
    private String message;
}
