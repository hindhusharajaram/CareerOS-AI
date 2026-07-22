package com.careerosai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddStudentSkillRequest {
    @NotBlank(message = "Skill name cannot be blank")
    private String skillName;

    private String category;
    private String icon;

    @NotBlank(message = "Proficiency cannot be blank")
    private String proficiency; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT

    private Double yearsOfExperience;
}
