package com.careerosai.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for User Authentication Login.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Email address cannot be blank")
    @Email(message = "Email address must be a valid format")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
