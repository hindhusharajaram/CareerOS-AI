package com.careerosai.intelligence.analytics;

import com.careerosai.intelligence.dto.TrendAnalyticsDto;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class TrendAnalyticsEngine {

    public TrendAnalyticsDto getPlatformAnalytics() {
        final Map<String, Integer> mostCommonSkills = new LinkedHashMap<>();
        mostCommonSkills.put("Java", 45);
        mostCommonSkills.put("Python", 38);
        mostCommonSkills.put("React", 32);
        mostCommonSkills.put("SQL", 29);
        mostCommonSkills.put("Spring Boot", 25);
        mostCommonSkills.put("TypeScript", 20);

        final Map<String, Integer> missingSkills = new LinkedHashMap<>();
        missingSkills.put("Docker & Kubernetes", 62);
        missingSkills.put("System Design", 54);
        missingSkills.put("Machine Learning", 48);
        missingSkills.put("AWS / Cloud", 42);

        final Map<String, Integer> techDistribution = new LinkedHashMap<>();
        techDistribution.put("Backend (Java/Spring/Node)", 40);
        techDistribution.put("Frontend (React/TypeScript)", 30);
        techDistribution.put("AI/ML & Data Science", 18);
        techDistribution.put("DevOps & Cloud", 12);

        final Map<String, Integer> projectCategories = new LinkedHashMap<>();
        projectCategories.put("Full-Stack Web App", 45);
        projectCategories.put("AI & Machine Learning Model", 25);
        projectCategories.put("REST API Backend Service", 20);
        projectCategories.put("Mobile App", 10);

        final Map<String, Integer> certificates = new LinkedHashMap<>();
        certificates.put("AWS Certified", 35);
        certificates.put("Coursera / DeepLearning.AI", 30);
        certificates.put("Oracle Java Certified", 20);
        certificates.put("NPTEL Certificate", 15);

        final Map<String, Integer> careerGoalTrends = new LinkedHashMap<>();
        careerGoalTrends.put("AI / ML Engineer", 38);
        careerGoalTrends.put("Software Engineer", 32);
        careerGoalTrends.put("Full Stack Developer", 20);
        careerGoalTrends.put("Data Scientist", 10);

        final Map<String, Integer> scoreDist = new LinkedHashMap<>();
        scoreDist.put("800 - 1000 (Job Ready)", 15);
        scoreDist.put("650 - 799 (Placement Ready)", 35);
        scoreDist.put("400 - 649 (Developing)", 40);
        scoreDist.put("0 - 399 (Beginner)", 10);

        return TrendAnalyticsDto.builder()
            .mostCommonSkills(mostCommonSkills)
            .missingSkillsDistribution(missingSkills)
            .technologyDistribution(techDistribution)
            .projectCategoryDistribution(projectCategories)
            .certificateDistribution(certificates)
            .careerGoalTrends(careerGoalTrends)
            .profileScoreDistribution(scoreDist)
            .build();
    }
}
