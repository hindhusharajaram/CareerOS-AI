package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileMetadataDto {
    private UUID id;
    private UUID studentId;
    private String fileName;
    private String originalFilename;
    private String filePath;
    private Long fileSize;
    private String contentType;
    private String uploadType;
    private LocalDateTime createdAt;
}
