package com.careerosai.dto;

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
public class StudentSkillDto {
    private UUID id;
    private UUID studentId;
    private UUID skillId;
    private String skillName;
    private String category;
    private String icon;
    private String proficiency;
    private Double yearsOfExperience;
}
