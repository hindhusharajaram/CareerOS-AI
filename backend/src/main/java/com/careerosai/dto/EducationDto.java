package com.careerosai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationDto {
    private UUID id;
    private UUID studentId;

    @NotBlank(message = "Institution cannot be blank")
    private String institution;

    @NotBlank(message = "Degree cannot be blank")
    private String degree;

    private String specialization;

    @NotNull(message = "Start year is required")
    private Integer startYear;

    private Integer endYear;
    private BigDecimal cgpa;
}
