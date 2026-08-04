package com.careerosai.service.impl;

import com.careerosai.dto.SectionHeatmapDto;
import com.careerosai.service.ResumeHeatmapService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Implementation of ResumeHeatmapService.
 */
@Service
public class ResumeHeatmapServiceImpl implements ResumeHeatmapService {

    private static final Pattern SUMMARY_PATTERN = Pattern.compile("\\b(summary|profile|about me|objective)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern EDU_PATTERN = Pattern.compile("\\b(education|academic|university|degree)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern EXP_PATTERN = Pattern.compile("\\b(experience|work history|employment|internship)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern PROJ_PATTERN = Pattern.compile("\\b(projects?|portfolio)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern SKILLS_PATTERN = Pattern.compile("\\b(skills?|technologies|technical skills)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern CERTS_PATTERN = Pattern.compile("\\b(certifications?|courses?|licenses?)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern ACHIEVEMENTS_PATTERN = Pattern.compile("\\b(achievements?|honors?|awards?|accomplishments?)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern OPEN_SOURCE_PATTERN = Pattern.compile("\\b(open source|github|contributions?)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern LANGUAGES_PATTERN = Pattern.compile("\\b(languages?|spoken languages)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern PUBS_PATTERN = Pattern.compile("\\b(publications?|research|papers?)\\b", Pattern.CASE_INSENSITIVE);

    @Override
    public List<SectionHeatmapDto> generateHeatmap(final String rawText) {
        final List<SectionHeatmapDto> heatmap = new ArrayList<>();
        final String text = rawText != null ? rawText : "";
        final String textLower = text.toLowerCase();

        // 1. Summary
        boolean hasSummary = SUMMARY_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Professional Summary",
            hasSummary ? "Present" : "Missing",
            hasSummary ? "Professional summary statement detected in document header." : "No professional summary or profile header found."));

        // 2. Education
        boolean hasEdu = EDU_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Education",
            hasEdu ? "Present" : "Missing",
            hasEdu ? "Education section detected detailing academic degree and university info." : "Missing Education section. Specify degree, university, and graduation year."));

        // 3. Experience
        boolean hasExp = EXP_PATTERN.matcher(text).find();
        boolean hasExpMetrics = textLower.contains("%") || Pattern.compile("\\d+").matcher(textLower).find();
        String expStatus = hasExp ? (hasExpMetrics ? "Present" : "Partial") : "Missing";
        String expDetails = hasExp
            ? (hasExpMetrics ? "Professional experience detected with metrics." : "Experience section detected, but bullet points lack measurable achievements.")
            : "No work history or internship section detected.";
        heatmap.add(new SectionHeatmapDto("Experience", expStatus, expDetails));

        // 4. Projects
        boolean hasProj = PROJ_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Projects",
            hasProj ? "Present" : "Missing",
            hasProj ? "Software engineering projects section detected." : "No dedicated Projects section found. Add 2-3 technical projects."));

        // 5. Skills
        boolean hasSkills = SKILLS_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Skills",
            hasSkills ? "Present" : "Missing",
            hasSkills ? "Technical skills section detected with languages and tools." : "Missing Technical Skills section. List programming languages and frameworks."));

        // 6. Certifications
        boolean hasCerts = CERTS_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Certifications",
            hasCerts ? "Present" : "Missing",
            hasCerts ? "Certifications and professional courses section detected." : "No certifications or course credentials section found."));

        // 7. Open Source
        boolean hasOpenSource = OPEN_SOURCE_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Open Source",
            hasOpenSource ? "Present" : "Missing",
            hasOpenSource ? "Open-source contributions or GitHub link detected." : "No GitHub contribution or open-source section found."));

        // 8. Achievements
        boolean hasAchievements = ACHIEVEMENTS_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Achievements",
            hasAchievements ? "Present" : "Missing",
            hasAchievements ? "Honors, awards, or competitive achievements section detected." : "No honors, hackathon, or awards section detected."));

        // 9. Languages
        boolean hasLangs = LANGUAGES_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Languages",
            hasLangs ? "Present" : "Missing",
            hasLangs ? "Spoken or spoken language section detected." : "No spoken language section detected."));

        // 10. Publications
        boolean hasPubs = PUBS_PATTERN.matcher(text).find();
        heatmap.add(new SectionHeatmapDto("Publications",
            hasPubs ? "Present" : "Missing",
            hasPubs ? "Academic publications or research paper section detected." : "No academic publications or research paper section found."));

        return heatmap;
    }
}
