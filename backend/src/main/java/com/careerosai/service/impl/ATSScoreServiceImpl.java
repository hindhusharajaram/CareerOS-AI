package com.careerosai.service.impl;

import com.careerosai.dto.AtsCategoryScoreDto;
import com.careerosai.service.ATSScoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Implementation of ATSScoreService for deterministic evaluation of resume categories.
 */
@Slf4j
@Service
public class ATSScoreServiceImpl implements ATSScoreService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("linkedin", Pattern.CASE_INSENSITIVE);
    private static final Pattern GITHUB_PATTERN = Pattern.compile("github", Pattern.CASE_INSENSITIVE);

    private static final List<String> ACTION_VERBS = Arrays.asList(
        "built", "developed", "implemented", "engineered", "designed", "led",
        "architected", "optimized", "created", "scaled", "managed", "deployed",
        "automated", "spearheaded", "refactored", "improved", "launched", "reduced"
    );

    private static final List<String> SWE_KEYWORDS = Arrays.asList(
        "Java", "Spring Boot", "React", "TypeScript", "Docker", "AWS", "SQL",
        "Git", "CI/CD", "Microservices", "REST API", "Linux", "JUnit", "Redis",
        "GraphQL", "Node.js", "System Design", "Algorithms"
    );

    @Override
    public List<AtsCategoryScoreDto> evaluateCategories(final String rawText) {
        final List<AtsCategoryScoreDto> categories = new ArrayList<>();
        final String textLower = rawText != null ? rawText.toLowerCase() : "";

        // 1. Contact Information (15 pts)
        boolean hasEmail = EMAIL_PATTERN.matcher(rawText != null ? rawText : "").find();
        boolean hasPhone = PHONE_PATTERN.matcher(rawText != null ? rawText : "").find();
        boolean hasLinkedin = LINKEDIN_PATTERN.matcher(rawText != null ? rawText : "").find();
        boolean hasGithub = GITHUB_PATTERN.matcher(rawText != null ? rawText : "").find();

        int contactScore = 0;
        if (hasEmail) contactScore += 5;
        if (hasPhone) contactScore += 4;
        if (hasLinkedin) contactScore += 3;
        if (hasGithub) contactScore += 3;

        String contactExplanation = contactScore >= 12
            ? "Complete contact header detected including email, phone, LinkedIn, and GitHub links."
            : "Missing key contact channels. Ensure email, phone, LinkedIn, and GitHub profiles are clearly listed.";
        categories.add(new AtsCategoryScoreDto("Contact Information", contactScore, 15, contactExplanation));

        // 2. Education (15 pts)
        boolean hasEdu = textLower.contains("education") || textLower.contains("university")
            || textLower.contains("degree") || textLower.contains("bachelor") || textLower.contains("master") || textLower.contains("gpa");
        int eduScore = hasEdu ? 15 : 0;
        String eduExplanation = hasEdu
            ? "Academic qualifications, degree title, and university details cleanly identified."
            : "No designated Education section found. Add university name, degree, and graduation year.";
        categories.add(new AtsCategoryScoreDto("Education", eduScore, 15, eduExplanation));

        // 3. Experience (15 pts)
        boolean hasExp = textLower.contains("experience") || textLower.contains("employment") || textLower.contains("work history") || textLower.contains("internship");
        int expScore = hasExp ? 15 : 5;
        String expExplanation = hasExp
            ? "Work experience history and job titles detected with structured bullet points."
            : "Limited work history detected. Include internship or relevant professional experience.";
        categories.add(new AtsCategoryScoreDto("Experience", expScore, 15, expExplanation));

        // 4. Projects (15 pts)
        boolean hasProj = textLower.contains("project") || textLower.contains("portfolio");
        int projScore = hasProj ? 15 : 5;
        String projExplanation = hasProj
            ? "Software engineering projects section detected highlighting technical stack."
            : "Include a dedicated Projects section showcasing technical software builds.";
        categories.add(new AtsCategoryScoreDto("Projects", projScore, 15, projExplanation));

        // 5. Skills (10 pts)
        boolean hasSkills = textLower.contains("skills") || textLower.contains("technologies") || textLower.contains("technical skills");
        int skillsScore = hasSkills ? 10 : 0;
        String skillsExplanation = hasSkills
            ? "Explicit technical skills section identified with categorized programming languages and frameworks."
            : "Add a designated 'Technical Skills' section categorizing tools and languages.";
        categories.add(new AtsCategoryScoreDto("Skills", skillsScore, 10, skillsExplanation));

        // 6. Keywords (14 pts)
        int matchedKwCount = 0;
        for (String kw : SWE_KEYWORDS) {
            if (Pattern.compile("\\b" + Pattern.quote(kw) + "\\b", Pattern.CASE_INSENSITIVE).matcher(rawText != null ? rawText : "").find()) {
                matchedKwCount++;
            }
        }
        int kwScore = Math.min(14, (int) Math.round(((double) matchedKwCount / SWE_KEYWORDS.size()) * 14.0));
        String kwExplanation = String.format("Matched %d out of %d core software engineering industry keywords.", matchedKwCount, SWE_KEYWORDS.size());
        categories.add(new AtsCategoryScoreDto("Keywords", kwScore, 14, kwExplanation));

        // 7. Formatting (5 pts)
        boolean wellFormatted = hasEdu && hasSkills && (hasExp || hasProj);
        int formatScore = wellFormatted ? 5 : 2;
        String formatExplanation = wellFormatted
            ? "Standard section headers and clean ATS-parsable document formatting."
            : "Use standard section headers (Education, Experience, Projects, Skills) for optimal parsing.";
        categories.add(new AtsCategoryScoreDto("Formatting", formatScore, 5, formatExplanation));

        // 8. Action Verbs (10 pts)
        int verbCount = 0;
        for (String verb : ACTION_VERBS) {
            if (Pattern.compile("\\b" + Pattern.quote(verb) + "\\b", Pattern.CASE_INSENSITIVE).matcher(rawText != null ? rawText : "").find()) {
                verbCount++;
            }
        }
        int verbScore = Math.min(10, verbCount * 2);
        String verbExplanation = String.format("Found %d high-impact action verbs initiating experience statements.", verbCount);
        categories.add(new AtsCategoryScoreDto("Action Verbs", verbScore, 10, verbExplanation));

        // 9. Resume Length (5 pts)
        String[] words = (rawText != null ? rawText.trim() : "").split("\\s+");
        int wordCount = (rawText == null || rawText.isBlank() || (words.length == 1 && words[0].isEmpty())) ? 0 : words.length;
        int lengthScore = (wordCount >= 200 && wordCount <= 900) ? 5 : (wordCount > 0 ? 2 : 0);
        String lengthExplanation = String.format("Document length is %d words (%s for 1-2 page engineering resume).",
            wordCount, lengthScore == 5 ? "Optimal length" : "Needs adjustment");
        categories.add(new AtsCategoryScoreDto("Resume Length", lengthScore, 5, lengthExplanation));

        return categories;
    }

    @Override
    public int calculateTotalScore(final List<AtsCategoryScoreDto> categories) {
        if (categories == null || categories.isEmpty()) return 0;
        return Math.min(100, Math.max(0, categories.stream()
            .filter(cat -> cat != null)
            .mapToInt(cat -> cat.getCurrentScore())
            .sum()));
    }
}
