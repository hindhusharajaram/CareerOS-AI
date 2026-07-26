package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VersionInfoDto {
    private String version;
    private String releaseName;
    private String buildTimestamp;
    private String commitHash;
    private String environment;
    private List<String> enabledModules;
}
