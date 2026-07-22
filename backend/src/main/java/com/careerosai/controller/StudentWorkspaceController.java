package com.careerosai.controller;

import com.careerosai.dto.AddStudentSkillRequest;
import com.careerosai.dto.CareerGoalDto;
import com.careerosai.dto.CertificateDto;
import com.careerosai.dto.EducationDto;
import com.careerosai.dto.ExperienceDto;
import com.careerosai.dto.ProjectDto;
import com.careerosai.dto.SkillDto;
import com.careerosai.dto.StudentDashboardSummaryDto;
import com.careerosai.dto.StudentProfileDto;
import com.careerosai.dto.StudentSkillDto;
import com.careerosai.entity.User;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.StudentWorkspaceService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentWorkspaceController {

    private final StudentWorkspaceService studentWorkspaceService;
    private final UserRepository userRepository;

    private UUID getEffectiveUserId(final CustomUserPrincipal principal) {
        if (principal != null && principal.getId() != null) {
            return principal.getId();
        }
        // Fallback for development/testing environment
        final List<User> users = userRepository.findAll();
        if (!users.isEmpty()) {
            return users.get(0).getId();
        }
        throw new IllegalStateException("No authenticated user or database users found.");
    }

    // Dashboard Overview & Completion
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardSummaryDto>> getDashboard(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentDashboardSummaryDto summary = studentWorkspaceService.getDashboardSummary(userId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved successfully", summary, request.getRequestURI()));
    }

    // Profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfileDto profile = studentWorkspaceService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile, request.getRequestURI()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestBody final StudentProfileDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfileDto updated = studentWorkspaceService.updateProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated, request.getRequestURI()));
    }

    // Skills
    @GetMapping("/available-skills")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAvailableSkills(final HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Available skills retrieved", studentWorkspaceService.getAllAvailableSkills(), request.getRequestURI()));
    }

    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillDto>>> getStudentSkills(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Student skills retrieved", studentWorkspaceService.getStudentSkills(userId), request.getRequestURI()));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<StudentSkillDto>> addStudentSkill(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @Valid @RequestBody final AddStudentSkillRequest payload,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentSkillDto added = studentWorkspaceService.addStudentSkill(userId, payload);
        return new ResponseEntity<>(ApiResponse.success("Skill added to profile", added, request.getRequestURI()), HttpStatus.CREATED);
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<ApiResponse<Void>> removeStudentSkill(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID skillId,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        studentWorkspaceService.removeStudentSkill(userId, skillId);
        return ResponseEntity.ok(ApiResponse.success("Skill removed successfully", null, request.getRequestURI()));
    }

    // Education CRUD
    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<EducationDto>>> getEducation(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Education records retrieved", studentWorkspaceService.getEducationList(userId), request.getRequestURI()));
    }

    @PostMapping("/education")
    public ResponseEntity<ApiResponse<EducationDto>> addEducation(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @Valid @RequestBody final EducationDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final EducationDto added = studentWorkspaceService.addEducation(userId, dto);
        return new ResponseEntity<>(ApiResponse.success("Education record added", added, request.getRequestURI()), HttpStatus.CREATED);
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<ApiResponse<EducationDto>> updateEducation(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        @RequestBody final EducationDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final EducationDto updated = studentWorkspaceService.updateEducation(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Education record updated", updated, request.getRequestURI()));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        studentWorkspaceService.deleteEducation(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Education record deleted", null, request.getRequestURI()));
    }

    // Projects CRUD
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Projects list retrieved", studentWorkspaceService.getProjectsList(userId), request.getRequestURI()));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectDto>> addProject(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @Valid @RequestBody final ProjectDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final ProjectDto added = studentWorkspaceService.addProject(userId, dto);
        return new ResponseEntity<>(ApiResponse.success("Project added", added, request.getRequestURI()), HttpStatus.CREATED);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        @RequestBody final ProjectDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final ProjectDto updated = studentWorkspaceService.updateProject(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Project updated", updated, request.getRequestURI()));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        studentWorkspaceService.deleteProject(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted", null, request.getRequestURI()));
    }

    // Certificates CRUD
    @GetMapping("/certificates")
    public ResponseEntity<ApiResponse<List<CertificateDto>>> getCertificates(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Certificates list retrieved", studentWorkspaceService.getCertificatesList(userId), request.getRequestURI()));
    }

    @PostMapping("/certificates")
    public ResponseEntity<ApiResponse<CertificateDto>> addCertificate(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @Valid @RequestBody final CertificateDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final CertificateDto added = studentWorkspaceService.addCertificate(userId, dto);
        return new ResponseEntity<>(ApiResponse.success("Certificate added", added, request.getRequestURI()), HttpStatus.CREATED);
    }

    @PutMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<CertificateDto>> updateCertificate(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        @RequestBody final CertificateDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final CertificateDto updated = studentWorkspaceService.updateCertificate(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Certificate updated", updated, request.getRequestURI()));
    }

    @DeleteMapping("/certificates/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertificate(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        studentWorkspaceService.deleteCertificate(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Certificate deleted", null, request.getRequestURI()));
    }

    // Experience CRUD
    @GetMapping("/experience")
    public ResponseEntity<ApiResponse<List<ExperienceDto>>> getExperience(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Experience records retrieved", studentWorkspaceService.getExperienceList(userId), request.getRequestURI()));
    }

    @PostMapping("/experience")
    public ResponseEntity<ApiResponse<ExperienceDto>> addExperience(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @Valid @RequestBody final ExperienceDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final ExperienceDto added = studentWorkspaceService.addExperience(userId, dto);
        return new ResponseEntity<>(ApiResponse.success("Experience record added", added, request.getRequestURI()), HttpStatus.CREATED);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<ExperienceDto>> updateExperience(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        @RequestBody final ExperienceDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final ExperienceDto updated = studentWorkspaceService.updateExperience(userId, id, dto);
        return ResponseEntity.ok(ApiResponse.success("Experience record updated", updated, request.getRequestURI()));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        studentWorkspaceService.deleteExperience(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Experience record deleted", null, request.getRequestURI()));
    }

    // Career Goal CRUD
    @GetMapping("/career-goals")
    public ResponseEntity<ApiResponse<CareerGoalDto>> getCareerGoal(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Career Goal retrieved", studentWorkspaceService.getCareerGoal(userId), request.getRequestURI()));
    }

    @PutMapping("/career-goals")
    public ResponseEntity<ApiResponse<CareerGoalDto>> updateCareerGoal(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestBody final CareerGoalDto dto,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final CareerGoalDto updated = studentWorkspaceService.updateCareerGoal(userId, dto);
        return ResponseEntity.ok(ApiResponse.success("Career Goal updated successfully", updated, request.getRequestURI()));
    }
}
