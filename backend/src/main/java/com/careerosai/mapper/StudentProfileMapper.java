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
}
