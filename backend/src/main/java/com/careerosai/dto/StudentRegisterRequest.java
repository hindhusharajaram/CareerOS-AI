package com.careerosai.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for Student Account Registration.
 * Immutable input payload validated by Jakarta Bean Validation.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegisterRequest {

    @NotBlank(message = "Email address cannot be blank")
    @Email(message = "Email address must be a valid format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}<>]{8,64}$",
        message = "Password must be 8-64 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    )
    private String password;

    @NotBlank(message = "First name cannot be blank")
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    private String lastName;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must follow valid international E.164 format")
    private String phone;

    @NotBlank(message = "University name cannot be blank")
    private String universityName;

    @NotBlank(message = "Major cannot be blank")
    private String major;

    @DecimalMin(value = "0.0", message = "GPA cannot be negative")
    @DecimalMax(value = "4.0", message = "GPA cannot exceed 4.0")
    private BigDecimal gpa;

    @NotNull(message = "Graduation year cannot be null")
    @Min(value = 2024, message = "Graduation year must be 2024 or later")
    @Max(value = 2035, message = "Graduation year cannot exceed 2035")
    private Integer graduationYear;
}
