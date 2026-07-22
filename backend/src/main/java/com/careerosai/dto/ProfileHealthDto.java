package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileHealthDto {
    private int score; // 0-100
    private String grade; // A+, A, B+, B, C, D
    private Map<String, Integer> categoryScores;
    private List<String> missingSections;
    private List<String> suggestions;
    private List<String> priorityImprovements;
}
