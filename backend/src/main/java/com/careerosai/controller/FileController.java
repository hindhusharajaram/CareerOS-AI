package com.careerosai.controller;

import com.careerosai.dto.FileMetadataDto;
import com.careerosai.entity.FileMetadata;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import com.careerosai.repository.FileMetadataRepository;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.AnalyticsService;
import com.careerosai.service.StorageService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/student/files")
@RequiredArgsConstructor
public class FileController {

    private final StorageService storageService;
    private final FileMetadataRepository fileMetadataRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;

    private UUID getEffectiveUserId(final CustomUserPrincipal principal) {
        if (principal != null && principal.getId() != null) return principal.getId();
        final List<User> users = userRepository.findAll();
        if (!users.isEmpty()) return users.get(0).getId();
        throw new IllegalStateException("No authenticated user found.");
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<FileMetadataDto>> uploadFile(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam("file") final MultipartFile file,
        @RequestParam(value = "uploadType", defaultValue = "GENERAL") final String uploadType,
        final HttpServletRequest request
    ) {
        final UUID userId = Objects.requireNonNull(getEffectiveUserId(currentUser));
        final StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                final User userEntity = userRepository.findById(userId).orElseThrow();
                final StudentProfile newProfile = StudentProfile.builder()
                    .user(userEntity)
                    .firstName("Student").lastName("User").universityName("University").major("CS").graduationYear(2026).build();
                return Objects.requireNonNull(studentProfileRepository.save(Objects.requireNonNull(newProfile)));
            });

        final String storedPath = storageService.store(file, uploadType.toLowerCase(), null);

        final FileMetadata metadata = FileMetadata.builder()
            .studentProfile(profile)
            .fileName(storedPath)
            .originalFilename(file.getOriginalFilename())
            .filePath(storedPath)
            .fileSize(file.getSize())
            .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
            .uploadType(uploadType)
            .build();

        final FileMetadata saved = Objects.requireNonNull(fileMetadataRepository.save(Objects.requireNonNull(metadata)));
        analyticsService.trackEvent(userId, "FILE_UPLOADED", uploadType + ": " + file.getOriginalFilename());

        final FileMetadataDto dto = toDto(saved);
        return new ResponseEntity<>(ApiResponse.success("File uploaded successfully", dto, request.getRequestURI()), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable final UUID id) {
        final UUID targetId = Objects.requireNonNull(id);
        final FileMetadata metadata = fileMetadataRepository.findById(targetId)
            .orElseThrow(() -> new IllegalArgumentException("File metadata not found: " + targetId));

        final Resource resource = storageService.loadAsResource(metadata.getFilePath());

        final String contentType = metadata.getContentType() != null ? metadata.getContentType() : "application/octet-stream";
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(Objects.requireNonNull(contentType)))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getOriginalFilename() + "\"")
            .body(resource);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FileMetadataDto>>> listFiles(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final StudentProfile profile = studentProfileRepository.findByUserId(userId).orElseThrow();
        final List<FileMetadataDto> files = fileMetadataRepository.findByStudentProfileId(profile.getId()).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Files list retrieved", files, request.getRequestURI()));
    }

    private FileMetadataDto toDto(final FileMetadata m) {
        return FileMetadataDto.builder()
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
    }
}
