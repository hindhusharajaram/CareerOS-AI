package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String profilePhoto;
    private String phone;
    private String phoneNumber; // Alias for phone
    private String gender;
    private String dateOfBirth;
    private String city;
    private String state;
    private String country;
    private String universityName;
    private String university; // Alias for universityName
    private String degree;
    private String major;
    private String branch;
    private BigDecimal gpa;
    private Integer graduationYear;
    private Integer currentSemester;
    private String about;
    private String linkedin;
    private String linkedInUrl; // Alias for linkedin
    private String github;
    private String githubUrl; // Alias for github
    private String portfolio;
    private String portfolioUrl; // Alias for portfolio
    private String aiModelPreference;
    private String primaryCareerFocus;
    private List<String> atsSkills;

    public String getEffectivePhone() {
        if (phone != null && !phone.isBlank()) return phone;
        return phoneNumber;
    }

    public String getEffectiveUniversity() {
        if (universityName != null && !universityName.isBlank()) return universityName;
        return university;
    }

    public String getEffectiveLinkedin() {
        if (linkedin != null && !linkedin.isBlank()) return linkedin;
        return linkedInUrl;
    }

    public String getEffectiveGithub() {
        if (github != null && !github.isBlank()) return github;
        return githubUrl;
    }

    public String getEffectivePortfolio() {
        if (portfolio != null && !portfolio.isBlank()) return portfolio;
        return portfolioUrl;
    }
}
