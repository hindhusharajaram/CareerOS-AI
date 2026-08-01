package com.careerosai.intelligence.rules;

import com.careerosai.entity.CareerGoal;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.StudentSkill;
import com.careerosai.intelligence.dto.SkillGapDto;
import com.careerosai.repository.CareerGoalRepository;
import com.careerosai.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SkillGapEngine {

    private final StudentSkillRepository studentSkillRepository;
    private final CareerGoalRepository careerGoalRepository;

    private static final Map<String, List<String>> ROLE_REQUIRED_SKILLS = new HashMap<>();

    static {
        ROLE_REQUIRED_SKILLS.put("AI ENGINEER", Arrays.asList("Python", "Machine Learning", "PyTorch", "Data Structures", "SQL", "Docker"));
        ROLE_REQUIRED_SKILLS.put("SOFTWARE ENGINEER", Arrays.asList("Java", "Spring Boot", "React", "PostgreSQL", "Data Structures", "Git", "REST APIs"));
        ROLE_REQUIRED_SKILLS.put("FULL STACK DEVELOPER", Arrays.asList("React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "REST APIs", "Git"));
        ROLE_REQUIRED_SKILLS.put("BACKEND DEVELOPER", Arrays.asList("Java", "Spring Boot", "PostgreSQL", "SQL", "Docker", "REST APIs"));
        ROLE_REQUIRED_SKILLS.put("FRONTEND DEVELOPER", Arrays.asList("React", "TypeScript", "Tailwind CSS", "JavaScript", "HTML", "CSS", "REST APIs"));
    }

    public SkillGapDto analyzeGap(final StudentProfile profile) {
        final UUID profileId = profile.getId();
        final Optional<CareerGoal> goalOpt = careerGoalRepository.findByStudentProfileId(profileId);

        final String targetRole = goalOpt.isPresent() && goalOpt.get().getPreferredRole() != null
            ? goalOpt.get().getPreferredRole().toUpperCase()
            : "SOFTWARE ENGINEER";

        final List<StudentSkill> userSkills = studentSkillRepository.findByStudentProfileId(profileId);
        final Set<String> userSkillNames = userSkills.stream()
            .map(s -> s.getSkill().getSkillName().toUpperCase())
            .collect(Collectors.toSet());

        final List<String> required = ROLE_REQUIRED_SKILLS.entrySet().stream()
            .filter(e -> targetRole.contains(e.getKey()) || e.getKey().contains(targetRole))
            .map(entry -> entry.getValue())
            .findFirst()
            .orElse(Arrays.asList("Java", "Python", "React", "SQL", "Git", "Data Structures"));

        final List<SkillGapDto.SkillGapItem> missingItems = new ArrayList<>();
        final List<SkillGapDto.SkillGapItem> recommendedItems = new ArrayList<>();

        for (String reqSkill : required) {
            if (!userSkillNames.contains(reqSkill.toUpperCase())) {
                final String difficulty = reqSkill.contains("Machine Learning") || reqSkill.contains("Docker") ? "HARD" : "INTERMEDIATE";
                final int hours = difficulty.equals("HARD") ? 60 : 30;

                final SkillGapDto.SkillGapItem item = SkillGapDto.SkillGapItem.builder()
                    .skillName(reqSkill)
                    .category("Target Role Essential")
                    .priorityLevel("HIGH")
                    .learningDifficulty(difficulty)
                    .estimatedLearningHours(hours)
                    .build();

                missingItems.add(item);
                recommendedItems.add(item);
            }
        }

        return SkillGapDto.builder()
            .preferredRole(targetRole)
            .currentSkills(userSkills.stream().map(s -> s.getSkill().getSkillName()).collect(Collectors.toList()))
            .missingSkills(missingItems)
            .recommendedSkills(recommendedItems)
            .build();
    }
}
