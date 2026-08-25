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

    private static final Map<String, List<RoleSkillSpec>> ROLE_SPECS = new HashMap<>();

    public static class RoleSkillSpec {
        public final String name;
        public final String category;
        public final String priority;
        public final String difficulty;
        public final int hours;

        public RoleSkillSpec(String name, String category, String priority, String difficulty, int hours) {
            this.name = name;
            this.category = category;
            this.priority = priority;
            this.difficulty = difficulty;
            this.hours = hours;
        }
    }

    static {
        ROLE_SPECS.put("SOFTWARE ENGINEER", Arrays.asList(
            new RoleSkillSpec("Java", "Core Language", "HIGH", "INTERMEDIATE", 30),
            new RoleSkillSpec("Spring Boot", "Backend Framework", "HIGH", "HARD", 45),
            new RoleSkillSpec("React", "Frontend Framework", "HIGH", "INTERMEDIATE", 30),
            new RoleSkillSpec("PostgreSQL", "Database Architecture", "MEDIUM", "INTERMEDIATE", 25),
            new RoleSkillSpec("Data Structures & Algorithms", "Core Computer Science", "HIGH", "HARD", 60),
            new RoleSkillSpec("Docker", "Containerization", "MEDIUM", "INTERMEDIATE", 20),
            new RoleSkillSpec("Git", "Version Control", "LOW", "EASY", 10)
        ));

        ROLE_SPECS.put("BACKEND DEVELOPER", Arrays.asList(
            new RoleSkillSpec("Java", "Core Language", "HIGH", "INTERMEDIATE", 30),
            new RoleSkillSpec("Spring Boot", "Backend Framework", "HIGH", "HARD", 45),
            new RoleSkillSpec("PostgreSQL", "Relational Storage", "HIGH", "INTERMEDIATE", 25),
            new RoleSkillSpec("Redis", "Caching Layer", "MEDIUM", "INTERMEDIATE", 15),
            new RoleSkillSpec("Docker", "DevOps Core", "HIGH", "INTERMEDIATE", 25),
            new RoleSkillSpec("Microservices Architecture", "Distributed Systems", "MEDIUM", "HARD", 50),
            new RoleSkillSpec("REST APIs", "API Design", "LOW", "EASY", 10)
        ));

        ROLE_SPECS.put("FRONTEND DEVELOPER", Arrays.asList(
            new RoleSkillSpec("React", "Core Framework", "HIGH", "INTERMEDIATE", 35),
            new RoleSkillSpec("TypeScript", "Type Safety", "HIGH", "INTERMEDIATE", 30),
            new RoleSkillSpec("Tailwind CSS", "Styling Design", "MEDIUM", "EASY", 15),
            new RoleSkillSpec("Next.js App Router", "SSR Framework", "HIGH", "HARD", 40),
            new RoleSkillSpec("Web Performance Tuning", "Optimization", "LOW", "INTERMEDIATE", 20),
            new RoleSkillSpec("HTML5 & Modern CSS", "Web Basics", "LOW", "EASY", 10)
        ));

        ROLE_SPECS.put("DATA SCIENCE & AI", Arrays.asList(
            new RoleSkillSpec("Python 3", "Data Language", "HIGH", "EASY", 20),
            new RoleSkillSpec("Pandas & NumPy", "Data Wrangling", "HIGH", "INTERMEDIATE", 25),
            new RoleSkillSpec("Scikit-Learn", "Machine Learning", "HIGH", "HARD", 45),
            new RoleSkillSpec("PyTorch", "Deep Learning", "HIGH", "HARD", 60),
            new RoleSkillSpec("SQL", "Data Queries", "MEDIUM", "INTERMEDIATE", 20),
            new RoleSkillSpec("RAG & Vector DBs", "Generative AI", "MEDIUM", "HARD", 40)
        ));

        ROLE_SPECS.put("DEVOPS & CLOUD", Arrays.asList(
            new RoleSkillSpec("Linux Administration", "OS Core", "HIGH", "INTERMEDIATE", 30),
            new RoleSkillSpec("Docker Containers", "Containerization", "HIGH", "INTERMEDIATE", 25),
            new RoleSkillSpec("Kubernetes", "Orchestration", "HIGH", "HARD", 60),
            new RoleSkillSpec("Terraform", "Infrastructure as Code", "MEDIUM", "HARD", 40),
            new RoleSkillSpec("AWS Cloud Services", "Cloud Provider", "HIGH", "HARD", 50),
            new RoleSkillSpec("GitHub Actions CI/CD", "Automation", "LOW", "EASY", 15)
        ));
    }

    public SkillGapDto analyzeGap(final StudentProfile profile) {
        final UUID profileId = profile.getId();
        final Optional<CareerGoal> goalOpt = careerGoalRepository.findByStudentProfileId(profileId);

        String rawRole = (goalOpt.isPresent() && goalOpt.get().getPreferredRole() != null)
            ? goalOpt.get().getPreferredRole()
            : (profile.getPrimaryCareerFocus() != null ? profile.getPrimaryCareerFocus() : "Software Engineer");

        final String targetRoleUpper = rawRole.toUpperCase();

        final List<StudentSkill> userSkills = studentSkillRepository.findByStudentProfileId(profileId);
        final Set<String> userSkillNames = userSkills.stream()
            .map(s -> s.getSkill().getSkillName().toUpperCase())
            .collect(Collectors.toSet());

        List<RoleSkillSpec> specs = ROLE_SPECS.entrySet().stream()
            .filter(e -> targetRoleUpper.contains(e.getKey()) || e.getKey().contains(targetRoleUpper))
            .map(Map.Entry::getValue)
            .findFirst()
            .orElse(ROLE_SPECS.get("SOFTWARE ENGINEER"));

        final List<SkillGapDto.SkillGapItem> missingItems = new ArrayList<>();
        final List<SkillGapDto.SkillGapItem> recommendedItems = new ArrayList<>();

        for (RoleSkillSpec spec : specs) {
            if (!userSkillNames.contains(spec.name.toUpperCase())) {
                final SkillGapDto.SkillGapItem item = SkillGapDto.SkillGapItem.builder()
                    .skillName(spec.name)
                    .category(spec.category)
                    .priorityLevel(spec.priority)
                    .learningDifficulty(spec.difficulty)
                    .estimatedLearningHours(spec.hours)
                    .build();

                missingItems.add(item);
                recommendedItems.add(item);
            }
        }

        return SkillGapDto.builder()
            .preferredRole(rawRole)
            .currentSkills(userSkills.stream().map(s -> s.getSkill().getSkillName()).collect(Collectors.toList()))
            .missingSkills(missingItems)
            .recommendedSkills(recommendedItems)
            .build();
    }
}

