package com.careerosai.facade.impl;

import com.careerosai.builder.ResumeResponseBuilder;
import com.careerosai.dto.AtsCategoryScoreDto;

import com.careerosai.dto.InsightDto;
import com.careerosai.dto.KeywordAnalysisDto;
import com.careerosai.dto.ParsedResumeDto;
import com.careerosai.dto.QuantificationBulletDto;
import com.careerosai.dto.ResumeHealthDto;
import com.careerosai.dto.ResumeReviewResponseDto;
import com.careerosai.dto.SectionHeatmapDto;
import com.careerosai.facade.ResumeReviewFacade;
import com.careerosai.service.ATSScoreService;
import com.careerosai.service.KeywordAnalysisService;
import com.careerosai.service.QuantificationDetectorService;
import com.careerosai.service.ResumeHealthService;
import com.careerosai.service.ResumeHeatmapService;
import com.careerosai.service.ResumeInsightsService;
import com.careerosai.service.ResumeParserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

/**
 * Facade implementation orchestrating single-pass Tika document parsing and sub-service evaluations.
 * Adheres strictly to SOLID, Single Responsibility Principle, and Constructor Injection.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeReviewFacadeImpl implements ResumeReviewFacade {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".docx", ".doc");

    private final ResumeParserService resumeParserService;
    private final ATSScoreService atsScoreService;
    private final ResumeHealthService resumeHealthService;
    private final ResumeHeatmapService resumeHeatmapService;
    private final KeywordAnalysisService keywordAnalysisService;
    private final QuantificationDetectorService quantificationDetectorService;
    private final ResumeInsightsService resumeInsightsService;
    private final ResumeResponseBuilder responseBuilder;

    @Override
    public ResumeReviewResponseDto reviewResume(final MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file must not be empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 5 MB.");
        }

        final String rawFilename = file.getOriginalFilename();
        final String originalFilename = (rawFilename != null && !rawFilename.isBlank()) ? rawFilename : "resume.pdf";
        final String lowerFilename = originalFilename.toLowerCase();
        boolean validExtension = ALLOWED_EXTENSIONS.stream().anyMatch(lowerFilename::endsWith);
        if (!validExtension) {
            throw new IllegalArgumentException("Invalid file extension. Only PDF and DOCX files are allowed.");
        }

        // 1. Execute Tika Parsing EXACTLY ONCE
        log.info("Ingesting resume file '{}' for single-pass Apache Tika parsing...", originalFilename);
        final ParsedResumeDto parsedResume = resumeParserService.parseResume(file);
        final String rawText = parsedResume != null && parsedResume.getRawText() != null
            ? parsedResume.getRawText()
            : "";

        // 2. Delegate in-memory rawText to all deterministic engines
        final List<AtsCategoryScoreDto> categoryBreakdown = atsScoreService.evaluateCategories(rawText);
        final int overallScore = atsScoreService.calculateTotalScore(categoryBreakdown);
        final ResumeHealthDto health = resumeHealthService.evaluateHealth(overallScore);
        final List<SectionHeatmapDto> heatmap = resumeHeatmapService.generateHeatmap(rawText);
        final KeywordAnalysisDto keywords = keywordAnalysisService.analyzeKeywords(rawText);
        final List<QuantificationBulletDto> quantification = quantificationDetectorService.detectQuantification(rawText);
        final List<InsightDto> insights = resumeInsightsService.generateInsights(rawText, categoryBreakdown, heatmap, keywords);

        // 3. Assemble and sanitize final response (raw text excluded for security)
        return responseBuilder.buildResponse(
            overallScore,
            health,
            categoryBreakdown,
            heatmap,
            keywords,
            quantification,
            insights,
            originalFilename
        );
    }
}
