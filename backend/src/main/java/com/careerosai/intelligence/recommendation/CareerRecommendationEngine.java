package com.careerosai.intelligence.recommendation;

import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.StudentSkill;
import com.careerosai.intelligence.dto.RecommendationDto;
import com.careerosai.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CareerRecommendationEngine {

    private final StudentSkillRepository studentSkillRepository;

    public RecommendationDto generateRecommendations(final StudentProfile profile) {
        final UUID profileId = profile.getId();

        final Set<String> userSkills = studentSkillRepository.findByStudentProfileId(profileId).stream()
            .map(s -> s.getSkill().getSkillName().toUpperCase())
            .collect(Collectors.toSet());

        final List<String> roles = new ArrayList<>();
        final List<String> domains = new ArrayList<>();
        final List<RecommendationDto.RecommendationItem> items = new ArrayList<>();

        if (userSkills.contains("JAVA") || userSkills.contains("SPRING BOOT")) {
            roles.add("Java Backend Engineer");
            domains.add("Fintech & Enterprise Software");
            items.add(RecommendationDto.RecommendationItem.builder()
                .title("AWS Certified Developer - Associate")
                .category("CERTIFICATION")
                .reason("Matches your Java/Spring Boot skill set and boosts backend candidate ranking by 45%.")
                .priority("HIGH")
                .confidenceScore(0.94)
                .build());
            items.add(RecommendationDto.RecommendationItem.builder()
                .title("NPTEL: Microservices & Cloud Architecture")
                .category("NPTEL_COURSE")
                .reason("Fills key architecture requirement for enterprise tier placement.")
                .priority("HIGH")
                .confidenceScore(0.91)
                .build());
        }

        if (userSkills.contains("PYTHON") || userSkills.contains("MACHINE LEARNING")) {
            roles.add("AI / ML Engineer");
            domains.add("Artificial Intelligence & Data Analytics");
            items.add(RecommendationDto.RecommendationItem.builder()
                .title("TensorFlow / PyTorch Neural Network Project")
                .category("PROJECT")
                .reason("Demonstrates practical deep learning experience for top AI research internships.")
                .priority("HIGH")
                .confidenceScore(0.96)
                .build());
            items.add(RecommendationDto.RecommendationItem.builder()
                .title("NPTEL: Deep Learning by IIT Madras")
                .category("NPTEL_COURSE")
                .reason("Establishes formal academic proof of neural network expertise.")
                .priority("MEDIUM")
                .confidenceScore(0.89)
                .build());
        }

        if (userSkills.contains("REACT") || userSkills.contains("TYPESCRIPT")) {
            roles.add("Full Stack React Engineer");
            domains.add("SaaS & Modern Web Platforms");
            items.add(RecommendationDto.RecommendationItem.builder()
                .title("Meta Front-End Developer Professional Certificate")
                .category("CERTIFICATION")
                .reason("Validates component architecture and modern UI/UX frontend patterns.")
                .priority("MEDIUM")
                .confidenceScore(0.88)
                .build());
        }

        if (roles.isEmpty()) {
            roles.addAll(Arrays.asList("Junior Software Engineer", "Associate QA Engineer"));
            domains.addAll(Arrays.asList("Information Technology Services", "Web Development"));
        }

        int interviewScore = Math.min(100, (int) (userSkills.size() * 15) + 30);

        return RecommendationDto.builder()
            .suitableRoles(roles)
            .suitableDomains(domains)
            .items(items)
            .interviewReadinessScore(interviewScore)
            .build();
    }
}
