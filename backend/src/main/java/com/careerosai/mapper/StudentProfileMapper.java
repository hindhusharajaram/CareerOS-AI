package com.careerosai.mapper;

import com.careerosai.dto.StudentRegisterRequest;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Component responsible for deterministic StudentProfile entity to DTO transformations.
 */
@Component
public class StudentProfileMapper {

    /**
     * Maps StudentRegisterRequest DTO to StudentProfile domain entity.
     */
    public StudentProfile toEntity(final StudentRegisterRequest request, final User user) {
        if (request == null) {
            return null;
        }

        return StudentProfile.builder()
            .user(user)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phone(request.getPhone())
            .universityName(request.getUniversityName())
            .major(request.getMajor())
            .gpa(request.getGpa())
            .graduationYear(request.getGraduationYear())
            .build();
    }

    /**
     * Maps StudentProfile entity to StudentProfileDto.
     */
    public com.careerosai.dto.StudentProfileDto toDto(final StudentProfile entity) {
        if (entity == null) {
            return null;
        }

        final String userFullName = entity.getUser() != null ? entity.getUser().getFullName() : null;
        final String userEmail = entity.getUser() != null ? entity.getUser().getEmail() : null;
        final String fullName = (entity.getFirstName() != null && entity.getLastName() != null)
            ? entity.getFirstName() + " " + entity.getLastName()
            : userFullName;

        List<String> atsSkillList = null;
        if (entity.getAtsSkills() != null && !entity.getAtsSkills().isBlank()) {
            atsSkillList = Arrays.asList(entity.getAtsSkills().split(","));
        }

        return com.careerosai.dto.StudentProfileDto.builder()
            .id(entity.getId())
            .userId(entity.getUser() != null ? entity.getUser().getId() : null)
            .firstName(entity.getFirstName())
            .lastName(entity.getLastName())
            .fullName(fullName)
            .email(userEmail)
            .profilePhoto(entity.getProfilePhoto())
            .phone(entity.getPhone())
            .phoneNumber(entity.getPhone())
            .gender(entity.getGender())
            .dateOfBirth(entity.getDateOfBirth())
            .city(entity.getCity())
            .state(entity.getState())
            .country(entity.getCountry())
            .universityName(entity.getUniversityName())
            .university(entity.getUniversityName())
            .degree(entity.getDegree())
            .major(entity.getMajor())
            .branch(entity.getBranch())
            .gpa(entity.getGpa())
            .graduationYear(entity.getGraduationYear())
            .currentSemester(entity.getCurrentSemester())
            .about(entity.getAbout())
            .linkedin(entity.getLinkedin())
            .linkedInUrl(entity.getLinkedin())
            .github(entity.getGithub())
            .githubUrl(entity.getGithub())
            .portfolio(entity.getPortfolio())
            .portfolioUrl(entity.getPortfolio())
            .aiModelPreference(entity.getAiModelPreference())
            .primaryCareerFocus(entity.getPrimaryCareerFocus())
            .atsSkills(atsSkillList)
            .build();
    }
}
