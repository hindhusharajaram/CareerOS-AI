package com.careerosai.mapper;

import com.careerosai.dto.StudentRegisterRequest;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import org.springframework.stereotype.Component;

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

        return com.careerosai.dto.StudentProfileDto.builder()
            .id(entity.getId())
            .userId(entity.getUser() != null ? entity.getUser().getId() : null)
            .firstName(entity.getFirstName())
            .lastName(entity.getLastName())
            .fullName(fullName)
            .email(userEmail)
            .profilePhoto(entity.getProfilePhoto())
            .phone(entity.getPhone())
            .gender(entity.getGender())
            .dateOfBirth(entity.getDateOfBirth())
            .city(entity.getCity())
            .state(entity.getState())
            .country(entity.getCountry())
            .universityName(entity.getUniversityName())
            .degree(entity.getDegree())
            .major(entity.getMajor())
            .branch(entity.getBranch())
            .gpa(entity.getGpa())
            .graduationYear(entity.getGraduationYear())
            .currentSemester(entity.getCurrentSemester())
            .about(entity.getAbout())
            .linkedin(entity.getLinkedin())
            .github(entity.getGithub())
            .portfolio(entity.getPortfolio())
            .build();
    }
}
