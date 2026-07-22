package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private String query;
    private List<StudentSkillDto> matchingSkills;
    private List<ProjectDto> matchingProjects;
    private List<CertificateDto> matchingCertificates;
    private List<ExperienceDto> matchingExperience;
    private List<EducationDto> matchingEducation;
}
