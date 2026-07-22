package com.careerosai.intelligence.ats;

import com.careerosai.entity.Resume;
import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.AtsScoreDto;
import com.careerosai.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AtsScoreEngine {

    private final ResumeRepository resumeRepository;

    public AtsScoreDto analyzeResume(final StudentProfile profile) {
        final Optional<Resume> activeResume = resumeRepository.findByStudentProfileIdAndIsActiveTrue(profile.getId());

        final Map<String, Boolean> sections = new LinkedHashMap<>();
        final List<String> suggestions = new ArrayList<>();
        final List<String> missing = new ArrayList<>();

        if (activeResume.isEmpty()) {
            missing.add("Active Resume Document");
            suggestions.add("Upload a PDF or DOCX resume to enable ATS evaluation.");
            return AtsScoreDto.builder()
                .atsScore(0)
                .sectionCompleteness(sections)
                .keywordDensityScore(0.0)
                .suggestions(suggestions)
                .missingSections(missing)
                .build();
        }

        final Resume resume = activeResume.get();
        final String text = resume.getParsedContent() != null ? resume.getParsedContent() : "";

        // Check Sections
        final boolean hasContact = text.toLowerCase().contains("email") || text.contains("@") || profile.getPhone() != null;
        final boolean hasEdu = text.toLowerCase().contains("education") || text.toLowerCase().contains("university");
        final boolean hasExp = text.toLowerCase().contains("experience") || text.toLowerCase().contains("intern");
        final boolean hasSkills = text.toLowerCase().contains("skills") || text.toLowerCase().contains("technologies");
        final boolean hasProjects = text.toLowerCase().contains("projects");
        final boolean hasGithub = text.toLowerCase().contains("github");
        final boolean hasLinkedin = text.toLowerCase().contains("linkedin");

        sections.put("Contact Info", hasContact);
        sections.put("Education", hasEdu);
        sections.put("Experience", hasExp);
        sections.put("Skills", hasSkills);
        sections.put("Projects", hasProjects);
        sections.put("GitHub Link", hasGithub);
        sections.put("LinkedIn Link", hasLinkedin);

        int score = 0;
        if (hasContact) score += 20; else { missing.add("Contact Info"); suggestions.add("Add contact email and phone number."); }
        if (hasEdu) score += 20; else { missing.add("Education Section"); suggestions.add("Include degree and university details."); }
        if (hasSkills) score += 20; else { missing.add("Skills Section"); suggestions.add("Add a designated Technical Skills section."); }
        if (hasProjects) score += 15; else { suggestions.add("Include a Projects section with technology highlights."); }
        if (hasExp) score += 15; else { suggestions.add("Add work or internship history."); }
        if (hasGithub) score += 5;
        if (hasLinkedin) score += 5;

        final double density = text.isBlank() ? 0.0 : Math.min(1.0, (double) text.split("\\s+").length / 300.0);

        return AtsScoreDto.builder()
            .atsScore(score)
            .sectionCompleteness(sections)
            .keywordDensityScore(Math.round(density * 100.0) / 100.0)
            .suggestions(suggestions)
            .missingSections(missing)
            .build();
    }
}
