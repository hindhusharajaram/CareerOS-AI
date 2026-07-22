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
public class ResumeDto {
    private UUID id;
    private UUID studentId;
    private FileMetadataDto file;
    private Integer version;
    private Boolean isActive;
    private String parsedContent;
    private LocalDateTime createdAt;
}
