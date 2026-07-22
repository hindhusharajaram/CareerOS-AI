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
public class ExperienceDto {
    private UUID id;
    private UUID studentId;

    @NotBlank(message = "Company cannot be blank")
    private String company;

    @NotBlank(message = "Role cannot be blank")
    private String role;

    private String description;
    private String startDate;
    private String endDate;
}
