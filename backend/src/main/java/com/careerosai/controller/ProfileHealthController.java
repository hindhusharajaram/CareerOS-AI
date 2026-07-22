package com.careerosai.controller;

import com.careerosai.dto.ProfileHealthDto;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.ProfileHealthEngine;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student/health")
@RequiredArgsConstructor
public class ProfileHealthController {

    private final ProfileHealthEngine profileHealthEngine;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    private UUID getEffectiveUserId(final CustomUserPrincipal principal) {
        if (principal != null && principal.getId() != null) return principal.getId();
        final List<User> users = userRepository.findAll();
        if (!users.isEmpty()) return users.get(0).getId();
        throw new IllegalStateException("No authenticated user found.");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileHealthDto>> getProfileHealth(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                .user(userRepository.findById(userId).orElseThrow())
                .firstName("Student").lastName("User").universityName("University").major("CS").graduationYear(2026).build()));

        final ProfileHealthDto health = profileHealthEngine.calculateHealth(profile);
        return ResponseEntity.ok(ApiResponse.success("Profile health details calculated successfully", health, request.getRequestURI()));
    }
}
