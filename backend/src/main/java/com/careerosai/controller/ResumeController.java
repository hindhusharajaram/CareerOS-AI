package com.careerosai.controller;

import com.careerosai.dto.AddStudentSkillRequest;
import com.careerosai.dto.FileMetadataDto;
import com.careerosai.dto.ParsedResumeDto;
import com.careerosai.dto.ResumeDto;
import com.careerosai.entity.FileMetadata;
import com.careerosai.entity.Resume;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import com.careerosai.repository.FileMetadataRepository;
import com.careerosai.repository.ResumeRepository;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.AnalyticsService;
import com.careerosai.service.ResumeParserService;
import com.careerosai.service.StorageService;
import com.careerosai.service.StudentWorkspaceService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.careerosai.analytics.events.ResumeUploadedEvent;
import com.careerosai.analytics.producer.EventPublisherService;

@RestController
@RequestMapping("/api/v1/student/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final StorageService storageService;
    private final ResumeParserService resumeParserService;
    private final FileMetadataRepository fileMetadataRepository;
    private final ResumeRepository resumeRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentWorkspaceService studentWorkspaceService;
    private final AnalyticsService analyticsService;
    private final EventPublisherService eventPublisherService;

    private UUID getEffectiveUserId(final CustomUserPrincipal principal) {
        if (principal != null && principal.getId() != null) return principal.getId();
        final List<User> users = userRepository.findAll();
        if (!users.isEmpty()) return users.get(0).getId();
        throw new IllegalStateException("No authenticated user found.");
    }

    @PostMapping("/upload")
    @Transactional
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam("file") final MultipartFile file,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                .user(userRepository.findById(userId).orElseThrow())
                .firstName("Student").lastName("User").universityName("University").major("CS").graduationYear(2026).build()));

        // Validate File Format
        final String orig = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        if (!orig.endsWith(".pdf") && !orig.endsWith(".docx") && !orig.endsWith(".doc")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid file format. Only PDF and DOCX resumes are supported.", 400, request.getRequestURI()));
        }

        // Store File
        final String storedPath = storageService.store(file, "resumes", null);
        final FileMetadata metadata = fileMetadataRepository.save(FileMetadata.builder()
            .studentProfile(profile)
            .fileName(storedPath)
            .originalFilename(file.getOriginalFilename())
            .filePath(storedPath)
            .fileSize(file.getSize())
            .contentType(file.getContentType() != null ? file.getContentType() : "application/pdf")
            .uploadType("RESUME")
            .build());

        // Parse Resume
        final ParsedResumeDto parsed = resumeParserService.parseResume(file);

        // Versioning Logic
        final long count = resumeRepository.countByStudentProfileId(profile.getId());
        final int nextVersion = (int) count + 1;

        // Deactivate previous active resumes
        resumeRepository.findByStudentProfileIdAndIsActiveTrue(profile.getId()).ifPresent(r -> {
            r.setIsActive(false);
            resumeRepository.save(r);
        });

        final Resume resume = resumeRepository.save(Resume.builder()
            .studentProfile(profile)
            .fileMetadata(metadata)
            .version(nextVersion)
            .isActive(true)
            .parsedContent(parsed.getRawText())
            .build());

        // Auto-Enrich Profile & Skills
        if (parsed.getExtractedSkills() != null) {
            for (String skill : parsed.getExtractedSkills()) {
                studentWorkspaceService.addStudentSkill(userId, AddStudentSkillRequest.builder()
                    .skillName(skill).proficiency("INTERMEDIATE").category("Parsed Skill").yearsOfExperience(1.0).build());
            }
        }

        analyticsService.trackEvent(userId, "RESUME_UPLOADED", "Version " + nextVersion + ": " + file.getOriginalFilename());
        eventPublisherService.publishEvent(new ResumeUploadedEvent(userId, file.getOriginalFilename(), nextVersion));

        final ResumeDto dto = toDto(resume);
        return new ResponseEntity<>(ApiResponse.success("Resume uploaded, parsed, and set as active version", dto, request.getRequestURI()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getResumes(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfile profile = studentProfileRepository.findByUserId(userId).orElseThrow();
        final List<ResumeDto> list = resumeRepository.findByStudentProfileIdOrderByVersionDesc(profile.getId()).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Resume version history retrieved", list, request.getRequestURI()));
    }

    @PutMapping("/{id}/active")
    @Transactional
    public ResponseEntity<ApiResponse<ResumeDto>> setActiveResume(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @PathVariable final UUID id,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfile profile = studentProfileRepository.findByUserId(userId).orElseThrow();

        resumeRepository.findByStudentProfileIdAndIsActiveTrue(profile.getId()).ifPresent(r -> {
            r.setIsActive(false);
            resumeRepository.save(r);
        });

        final Resume target = resumeRepository.findById(id).orElseThrow();
        target.setIsActive(true);
        final Resume updated = resumeRepository.save(target);

        return ResponseEntity.ok(ApiResponse.success("Active resume version updated", toDto(updated), request.getRequestURI()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteResume(@PathVariable final UUID id, final HttpServletRequest request) {
        resumeRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Resume version deleted", null, request.getRequestURI()));
    }

    private ResumeDto toDto(final Resume r) {
        final FileMetadata m = r.getFileMetadata();
        final FileMetadataDto metaDto = FileMetadataDto.builder()
            .id(m.getId())
            .studentId(m.getStudentProfile().getId())
            .fileName(m.getFileName())
            .originalFilename(m.getOriginalFilename())
            .filePath(m.getFilePath())
            .fileSize(m.getFileSize())
            .contentType(m.getContentType())
            .uploadType(m.getUploadType())
            .createdAt(m.getCreatedAt())
            .build();

        return ResumeDto.builder()
            .id(r.getId())
            .studentId(r.getStudentProfile().getId())
            .file(metaDto)
            .version(r.getVersion())
            .isActive(r.getIsActive())
            .parsedContent(r.getParsedContent())
            .createdAt(r.getCreatedAt())
            .build();
    }
}
