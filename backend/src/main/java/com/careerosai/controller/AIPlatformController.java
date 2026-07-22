package com.careerosai.controller;

import com.careerosai.ai.cache.AIResponseCache;
import com.careerosai.ai.context.AIContextEngine;
import com.careerosai.ai.dto.AIChatMessageDto;
import com.careerosai.ai.dto.AICopilotExplanationDto;
import com.careerosai.ai.dto.AILearningPlanDto;
import com.careerosai.ai.dto.AIMockInterviewDto;
import com.careerosai.ai.dto.AIProjectAdviceDto;
import com.careerosai.ai.dto.AIResumeReviewDto;
import com.careerosai.ai.provider.AIProvider;
import com.careerosai.ai.provider.AIProviderFactory;
import com.careerosai.entity.AIChatMessage;
import com.careerosai.entity.AIChatSession;
import com.careerosai.entity.Resume;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import com.careerosai.repository.AIChatMessageRepository;
import com.careerosai.repository.AIChatSessionRepository;
import com.careerosai.repository.ResumeRepository;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/student/ai")
@RequiredArgsConstructor
public class AIPlatformController {

    private final AIProviderFactory providerFactory;
    private final AIContextEngine contextEngine;
    private final AIResponseCache responseCache;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final AIChatSessionRepository chatSessionRepository;
    private final AIChatMessageRepository chatMessageRepository;

    private StudentProfile getProfile(final CustomUserPrincipal currentUser) {
        UUID userId = currentUser != null && currentUser.getId() != null ? currentUser.getId() : null;
        if (userId == null) {
            final List<User> users = userRepository.findAll();
            if (!users.isEmpty()) userId = users.get(0).getId();
        }
        final UUID finalUserId = userId;
        return studentProfileRepository.findByUserId(finalUserId)
            .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder()
                .user(userRepository.findById(finalUserId).orElseThrow())
                .firstName("Student").lastName("User").universityName("University").major("CS").graduationYear(2026).build()));
    }

    @GetMapping("/copilot/explain")
    public ResponseEntity<ApiResponse<AICopilotExplanationDto>> explainTopic(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam(value = "topic", defaultValue = "CAREER_SCORE") final String topic,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final String cacheKey = "copilot_" + profile.getId() + "_" + topic;
        final Object cached = responseCache.get(cacheKey);

        if (cached instanceof AICopilotExplanationDto) {
            return ResponseEntity.ok(ApiResponse.success("AI Copilot explanation retrieved (cached)", (AICopilotExplanationDto) cached, request.getRequestURI()));
        }

        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final AIProvider provider = providerFactory.getProvider();
        final AICopilotExplanationDto result = provider.explainTopic(topic, null, contextJson);

        responseCache.put(cacheKey, result);
        return ResponseEntity.ok(ApiResponse.success("AI Copilot explanation generated", result, request.getRequestURI()));
    }

    @PostMapping("/resume/review")
    public ResponseEntity<ApiResponse<AIResumeReviewDto>> reviewResume(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final Optional<Resume> activeResume = resumeRepository.findByStudentProfileIdAndIsActiveTrue(profile.getId());
        final String resumeText = activeResume.map(Resume::getParsedContent).orElse("");

        final AIProvider provider = providerFactory.getProvider();
        final AIResumeReviewDto review = provider.reviewResume(resumeText, contextJson);
        return ResponseEntity.ok(ApiResponse.success("AI Resume Review generated", review, request.getRequestURI()));
    }

    @PostMapping("/coaching/plan")
    public ResponseEntity<ApiResponse<AILearningPlanDto>> generateLearningPlan(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam(value = "targetRole", defaultValue = "Software Engineer") final String targetRole,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final AIProvider provider = providerFactory.getProvider();
        final AILearningPlanDto plan = provider.generateLearningPlan(targetRole, contextJson);
        return ResponseEntity.ok(ApiResponse.success("AI Learning Coach plan generated", plan, request.getRequestURI()));
    }

    @PostMapping("/interview/generate")
    public ResponseEntity<ApiResponse<AIMockInterviewDto>> generateMockInterview(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam(value = "targetRole", defaultValue = "Software Engineer") final String targetRole,
        @RequestParam(value = "difficulty", defaultValue = "INTERMEDIATE") final String difficulty,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final AIProvider provider = providerFactory.getProvider();
        final AIMockInterviewDto interview = provider.generateMockInterview(targetRole, difficulty, contextJson);
        return ResponseEntity.ok(ApiResponse.success("AI Mock Interview generated", interview, request.getRequestURI()));
    }

    @PostMapping("/project/analyze")
    public ResponseEntity<ApiResponse<AIProjectAdviceDto>> analyzeProject(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam(value = "title", defaultValue = "Full-Stack Web App") final String title,
        @RequestParam(value = "techStack", defaultValue = "React, Java, PostgreSQL") final String techStack,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final AIProvider provider = providerFactory.getProvider();
        final AIProjectAdviceDto advice = provider.analyzeProject(title, techStack, "Full-Stack Project Analysis", contextJson);
        return ResponseEntity.ok(ApiResponse.success("AI Project Advisor analysis generated", advice, request.getRequestURI()));
    }

    @GetMapping("/chat/messages")
    public ResponseEntity<ApiResponse<List<AIChatMessageDto>>> getChatMessages(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final List<AIChatSession> sessions = chatSessionRepository.findByStudentProfileIdOrderByCreatedAtDesc(profile.getId());
        if (sessions.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success("No messages", java.util.Collections.<AIChatMessageDto>emptyList(), request.getRequestURI()));
        }
        final List<AIChatMessageDto> list = chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessions.get(0).getId()).stream()
            .map(m -> AIChatMessageDto.builder()
                .id(m.getId())
                .sessionId(m.getSession().getId())
                .senderRole(m.getSenderRole())
                .messageText(m.getMessageText())
                .createdAt(m.getCreatedAt())
                .build())
            .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Chat messages retrieved", list, request.getRequestURI()));
    }

    @PostMapping("/chat/send")
    @Transactional
    public ResponseEntity<ApiResponse<AIChatMessageDto>> sendChatMessage(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam("messageText") final String messageText,
        final HttpServletRequest request
    ) {
        final StudentProfile profile = getProfile(currentUser);
        final List<AIChatSession> sessions = chatSessionRepository.findByStudentProfileIdOrderByCreatedAtDesc(profile.getId());
        final AIChatSession session = sessions.isEmpty()
            ? chatSessionRepository.save(AIChatSession.builder().studentProfile(profile).sessionTitle("Career Chat").build())
            : sessions.get(0);

        // Save User Message
        chatMessageRepository.save(AIChatMessage.builder()
            .session(session)
            .senderRole("USER")
            .messageText(messageText)
            .build());

        // Generate Grounded AI Response
        final String contextJson = contextEngine.buildStructuredContextJson(profile);
        final AIProvider provider = providerFactory.getProvider();
        final String aiResponseText = provider.generateChatResponse(messageText, "", contextJson);

        // Save AI Message
        final AIChatMessage aiMsg = chatMessageRepository.save(AIChatMessage.builder()
            .session(session)
            .senderRole("AI")
            .messageText(aiResponseText)
            .contextSnapshotJson(contextJson)
            .build());

        final AIChatMessageDto dto = AIChatMessageDto.builder()
            .id(aiMsg.getId())
            .sessionId(session.getId())
            .senderRole("AI")
            .messageText(aiResponseText)
            .createdAt(aiMsg.getCreatedAt())
            .build();

        return ResponseEntity.ok(ApiResponse.success("AI response generated", dto, request.getRequestURI()));
    }
}
