package com.careerosai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDto {
    private UUID id;
    private UUID studentId;

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Provider cannot be blank")
    private String provider;

    private String issueDate;
    private String credentialUrl;
}
