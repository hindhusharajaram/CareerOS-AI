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
public class ParsedResumeDto {
    private String name;
    private String email;
    private String phone;
    private String linkedin;
    private String github;
    private List<String> extractedSkills;
    private List<String> extractedEducation;
    private List<String> extractedExperience;
    private List<String> extractedProjects;
    private List<String> extractedCertifications;
    private String rawText;
}
