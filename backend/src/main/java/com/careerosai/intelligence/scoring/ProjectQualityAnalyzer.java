package com.careerosai.intelligence.scoring;

import com.careerosai.dto.ProjectDto;
import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.ProjectAnalysisDto;
import com.careerosai.service.StudentWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProjectQualityAnalyzer {

    private final StudentWorkspaceService studentWorkspaceService;

    public ProjectAnalysisDto analyzeProjects(final StudentProfile profile) {
        final List<ProjectDto> projects = studentWorkspaceService.getProjectsList(profile.getUser().getId());

        final List<ProjectAnalysisDto.SingleProjectAnalysis> list = new ArrayList<>();
        final List<String> globalSuggestions = new ArrayList<>();
        int totalScore = 0;

        for (ProjectDto proj : projects) {
            final List<String> suggestions = new ArrayList<>();
            int score = 40; // Base score for project submission

            final boolean hasGithub = proj.getGithubLink() != null && !proj.getGithubLink().isBlank();
            final boolean hasLive = proj.getLiveLink() != null && !proj.getLiveLink().isBlank();
            final boolean hasTech = proj.getTechnologies() != null && !proj.getTechnologies().isBlank();

            if (hasGithub) score += 25; else suggestions.add("Add a public GitHub repository link.");
            if (hasLive) score += 20; else suggestions.add("Deploy live demo (Render / Vercel / Netlify).");
            if (hasTech) score += 15; else suggestions.add("List technical stack tags used.");

            final String difficulty = (hasGithub && hasLive && hasTech) ? "ADVANCED" : (hasGithub ? "INTERMEDIATE" : "EASY");
            totalScore += score;

            list.add(ProjectAnalysisDto.SingleProjectAnalysis.builder()
                .projectId(proj.getId())
                .title(proj.getTitle())
                .qualityScore(score)
                .difficultyRating(difficulty)
                .hasGithub(hasGithub)
                .hasLiveDemo(hasLive)
                .suggestions(suggestions)
                .build());
        }

        if (projects.isEmpty()) {
            globalSuggestions.add("Build at least 2 full-stack projects using React, Spring Boot, and PostgreSQL.");
        } else if (projects.stream().noneMatch(p -> p.getLiveLink() != null && !p.getLiveLink().isBlank())) {
            globalSuggestions.add("Deploy at least one project live for interactive recruiter demonstration.");
        }

        final int avgScore = projects.isEmpty() ? 0 : totalScore / projects.size();

        return ProjectAnalysisDto.builder()
            .overallProjectScore(avgScore)
            .projectAnalyses(list)
            .recommendedImprovements(globalSuggestions)
            .build();
    }
}
