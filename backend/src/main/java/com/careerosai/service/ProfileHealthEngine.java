package com.careerosai.service;

import com.careerosai.dto.ProfileHealthDto;
import com.careerosai.entity.CareerGoal;
import com.careerosai.entity.StudentProfile;
import com.careerosai.repository.CareerGoalRepository;
import com.careerosai.repository.CertificateRepository;
import com.careerosai.repository.EducationRepository;
import com.careerosai.repository.ExperienceRepository;
import com.careerosai.repository.ProjectRepository;
import com.careerosai.repository.ResumeRepository;
import com.careerosai.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileHealthEngine {

    private final StudentSkillRepository studentSkillRepository;
    private final EducationRepository educationRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;
    private final ExperienceRepository experienceRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final ResumeRepository resumeRepository;

    public ProfileHealthDto calculateHealth(final StudentProfile profile) {
        final UUID profileId = profile.getId();

        final long skillsCount = studentSkillRepository.countByStudentProfileId(profileId);
        final long eduCount = educationRepository.countByStudentProfileId(profileId);
        final long projCount = projectRepository.countByStudentProfileId(profileId);
        final long certCount = certificateRepository.countByStudentProfileId(profileId);
        final long expCount = experienceRepository.countByStudentProfileId(profileId);
        final long resumeCount = resumeRepository.countByStudentProfileId(profileId);
        final Optional<CareerGoal> goalOpt = careerGoalRepository.findByStudentProfileId(profileId);

        final Map<String, Integer> scores = new LinkedHashMap<>();
        final List<String> missing = new ArrayList<>();
        final List<String> suggestions = new ArrayList<>();
        final List<String> priorityImprovements = new ArrayList<>();

        // 1. Personal & Contact (15%)
        int personalScore = 0;
        if (profile.getPhone() != null && !profile.getPhone().isBlank()) personalScore += 5;
        if (profile.getCity() != null || profile.getCountry() != null) personalScore += 5;
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) personalScore += 5;
        scores.put("Personal Profile", personalScore);
        if (personalScore < 15) {
            suggestions.add("Complete your bio summary and phone number.");
        }

        // 2. Resume Document (20%)
        int resumeScore = (resumeCount > 0) ? 20 : 0;
        scores.put("Resume Document", resumeScore);
        if (resumeScore == 0) {
            missing.add("Resume Document");
            priorityImprovements.add("Upload an active PDF or DOCX resume to enable automated ATS parsing.");
        }

        // 3. Technical Skills (20%)
        int skillScore = skillsCount >= 5 ? 20 : (skillsCount >= 2 ? 10 : 0);
        scores.put("Skills Matrix", skillScore);
        if (skillsCount < 3) {
            priorityImprovements.add("Add at least 3 skills to your competency matrix for AI recruiter matching.");
        }

        // 4. Projects & Portfolio (15%)
        int projScore = projCount >= 2 ? 15 : (projCount >= 1 ? 10 : 0);
        scores.put("Projects & Portfolio", projScore);
        if (projCount == 0) {
            missing.add("Projects");
            suggestions.add("Add at least 1 software project with a GitHub repository link.");
        }

        // 5. Education (10%)
        int eduScore = (eduCount > 0 || (profile.getUniversityName() != null && profile.getDegree() != null)) ? 10 : 0;
        scores.put("Education Records", eduScore);

        // 6. Experience & Internships (10%)
        int expScore = expCount > 0 ? 10 : 0;
        scores.put("Work Experience", expScore);
        if (expCount == 0) {
            suggestions.add("Add past internship, research, or work experience.");
        }

        // 7. Career Aspirations (10%)
        int goalScore = (goalOpt.isPresent() && goalOpt.get().getPreferredRole() != null) ? 10 : 0;
        scores.put("Career Goals", goalScore);
        if (goalScore == 0) {
            missing.add("Career Goals");
            priorityImprovements.add("Configure your target role, preferred work mode, and expected salary.");
        }

        final int totalScore = scores.values().stream().mapToInt(Integer::intValue).sum();
        final String grade = calculateGrade(totalScore);

        return ProfileHealthDto.builder()
            .score(totalScore)
            .grade(grade)
            .categoryScores(scores)
            .missingSections(missing)
            .suggestions(suggestions)
            .priorityImprovements(priorityImprovements)
            .build();
    }

    private String calculateGrade(final int score) {
        if (score >= 90) return "A+";
        if (score >= 80) return "A";
        if (score >= 70) return "B+";
        if (score >= 60) return "B";
        if (score >= 50) return "C";
        return "D";
    }
}
