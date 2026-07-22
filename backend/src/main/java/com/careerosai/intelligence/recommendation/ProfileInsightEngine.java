package com.careerosai.intelligence.recommendation;

import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.CareerScoreDto;
import com.careerosai.intelligence.dto.ProfileInsightDto;
import com.careerosai.intelligence.scoring.CareerScoreEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProfileInsightEngine {

    private final CareerScoreEngine careerScoreEngine;

    public ProfileInsightDto generateInsights(final StudentProfile profile) {
        final CareerScoreDto score = careerScoreEngine.calculateScore(profile);
        final int total = score.getOverallScore();

        final List<String> risks = new ArrayList<>();
        final List<String> missing = new ArrayList<>();

        if (profile.getGithub() == null || profile.getGithub().isBlank()) {
            risks.add("No GitHub link associated with profile.");
            missing.add("GitHub Profile Link");
        }
        if (profile.getLinkedin() == null || profile.getLinkedin().isBlank()) {
            missing.add("LinkedIn Profile Link");
        }

        String readiness = "BEGINNER";
        if (total >= 800) readiness = "JOB_READY";
        else if (total >= 650) readiness = "PLACEMENT_READY";
        else if (total >= 400) readiness = "DEVELOPING";

        return ProfileInsightDto.builder()
            .topStrengths(score.getStrengths())
            .topWeaknesses(score.getWeaknesses())
            .priorityImprovements(score.getImprovementAreas())
            .riskFactors(risks)
            .missingItems(missing)
            .readinessLevel(readiness)
            .build();
    }
}
