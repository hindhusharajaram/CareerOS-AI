package com.careerosai.ai.context;

import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.CareerScoreDto;
import com.careerosai.intelligence.dto.SkillGapDto;
import com.careerosai.intelligence.rules.SkillGapEngine;
import com.careerosai.intelligence.scoring.CareerScoreEngine;
import com.careerosai.repository.ProjectRepository;
import com.careerosai.repository.ResumeRepository;
import com.careerosai.repository.StudentSkillRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AIContextEngine {

    private final CareerScoreEngine careerScoreEngine;
    private final SkillGapEngine skillGapEngine;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;
    private final ResumeRepository resumeRepository;
    private final ObjectMapper objectMapper;

    public String buildStructuredContextJson(final StudentProfile profile) {
        final UUID profileId = profile.getId();

        final Map<String, Object> ctx = new LinkedHashMap<>();

        // Student Basic Info
        final Map<String, Object> info = new LinkedHashMap<>();
        info.put("studentId", profileId);
        info.put("name", profile.getFirstName() + " " + (profile.getLastName() != null ? profile.getLastName() : ""));
        info.put("university", profile.getUniversityName());
        info.put("major", profile.getMajor());
        info.put("graduationYear", profile.getGraduationYear());
        info.put("github", profile.getGithub());
        info.put("linkedin", profile.getLinkedin());
        ctx.put("candidate", info);

        // Skills
        ctx.put("verifiedSkills", studentSkillRepository.findByStudentProfileId(profileId).stream()
            .map(s -> s.getSkill().getSkillName())
            .collect(Collectors.toList()));

        // Projects Count
        ctx.put("projectsCount", projectRepository.countByStudentProfileId(profileId));

        // Active Resume Version
        resumeRepository.findByStudentProfileIdAndIsActiveTrue(profileId).ifPresent(r -> {
            ctx.put("activeResumeVersion", r.getVersion());
            ctx.put("hasResumeParsedContent", r.getParsedContent() != null && !r.getParsedContent().isBlank());
        });

        // Intelligence Outputs Grounding
        final CareerScoreDto score = careerScoreEngine.calculateScore(profile);
        ctx.put("careerScore", score.getOverallScore());

        final SkillGapDto gap = skillGapEngine.analyzeGap(profile);
        ctx.put("targetRole", gap.getPreferredRole());
        ctx.put("missingSkillsCount", gap.getMissingSkills().size());

        try {
            return objectMapper.writeValueAsString(ctx);
        } catch (Exception e) {
            return "{\"studentId\":\"" + profileId + "\"}";
        }
    }
}
