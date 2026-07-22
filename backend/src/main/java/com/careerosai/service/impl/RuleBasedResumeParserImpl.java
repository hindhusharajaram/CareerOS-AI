package com.careerosai.service.impl;

import com.careerosai.dto.ParsedResumeDto;
import com.careerosai.service.ResumeParserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class RuleBasedResumeParserImpl implements ResumeParserService {

    private final Tika tika = new Tika();

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d{1,3}[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}");
    private static final Pattern LINKEDIN_PATTERN = Pattern.compile("(?:https?:\\/\\/)?(?:www\\.)?linkedin\\.com\\/in\\/[a-zA-Z0-9_-]+");
    private static final Pattern GITHUB_PATTERN = Pattern.compile("(?:https?:\\/\\/)?(?:www\\.)?github\\.com\\/[a-zA-Z0-9_-]+");

    private static final List<String> SKILL_TAXONOMY_KEYWORDS = Arrays.asList(
        "Java", "Python", "React", "TypeScript", "JavaScript", "Spring Boot", "PostgreSQL",
        "Node.js", "SQL", "Machine Learning", "Data Structures", "Docker", "Git",
        "Tailwind CSS", "REST APIs", "AWS", "Kubernetes", "C++", "HTML", "CSS"
    );

    @Override
    public ParsedResumeDto parseResume(final MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            return parseResumeStream(is, file.getOriginalFilename());
        } catch (Exception e) {
            log.error("Failed to parse uploaded resume file: {}", file.getOriginalFilename(), e);
            return ParsedResumeDto.builder().rawText("Error parsing document: " + e.getMessage()).build();
        }
    }

    @Override
    public ParsedResumeDto parseResumeStream(final InputStream inputStream, final String fileName) {
        String rawText = "";
        try {
            rawText = tika.parseToString(inputStream);
        } catch (Exception e) {
            log.warn("Tika text extraction fallback for: {}", fileName, e);
            rawText = "Parsed Document: " + fileName;
        }

        final String email = findFirstMatch(EMAIL_PATTERN, rawText);
        final String phone = findFirstMatch(PHONE_PATTERN, rawText);
        final String linkedin = findFirstMatch(LINKEDIN_PATTERN, rawText);
        final String github = findFirstMatch(GITHUB_PATTERN, rawText);

        final List<String> extractedSkills = new ArrayList<>();
        for (String skill : SKILL_TAXONOMY_KEYWORDS) {
            if (Pattern.compile("\\b" + Pattern.quote(skill) + "\\b", Pattern.CASE_INSENSITIVE).matcher(rawText).find()) {
                extractedSkills.add(skill);
            }
        }

        final List<String> extractedEducation = extractSection(rawText, "Education", "Experience", "Projects", "Skills");
        final List<String> extractedExperience = extractSection(rawText, "Experience", "Projects", "Skills", "Education");
        final List<String> extractedProjects = extractSection(rawText, "Projects", "Experience", "Certifications", "Skills");
        final List<String> extractedCertifications = extractSection(rawText, "Certifications", "Projects", "Education", "Experience");

        return ParsedResumeDto.builder()
            .email(email)
            .phone(phone)
            .linkedin(linkedin)
            .github(github)
            .extractedSkills(extractedSkills)
            .extractedEducation(extractedEducation)
            .extractedExperience(extractedExperience)
            .extractedProjects(extractedProjects)
            .extractedCertifications(extractedCertifications)
            .rawText(rawText)
            .build();
    }

    private String findFirstMatch(final Pattern pattern, final String text) {
        final Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group() : null;
    }

    private List<String> extractSection(final String text, final String sectionHeader, final String... nextHeaders) {
        final List<String> lines = new ArrayList<>();
        final String[] textLines = text.split("\\r?\\n");
        boolean insideSection = false;

        for (String line : textLines) {
            final String trimmed = line.trim();
            if (trimmed.equalsIgnoreCase(sectionHeader) || trimmed.equalsIgnoreCase(sectionHeader + ":")) {
                insideSection = true;
                continue;
            }
            if (insideSection) {
                for (String next : nextHeaders) {
                    if (trimmed.equalsIgnoreCase(next) || trimmed.equalsIgnoreCase(next + ":")) {
                        insideSection = false;
                        break;
                    }
                }
                if (!insideSection) break;
                if (!trimmed.isEmpty()) {
                    lines.add(trimmed);
                }
            }
        }
        return lines;
    }
}
