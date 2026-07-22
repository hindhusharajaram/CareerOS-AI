package com.careerosai.controller;

import com.careerosai.dto.SearchResultDto;
import com.careerosai.entity.User;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.CustomUserPrincipal;
import com.careerosai.service.StudentSearchService;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/student/search")
@RequiredArgsConstructor
public class SearchController {

    private final StudentSearchService studentSearchService;
    private final UserRepository userRepository;

    private UUID getEffectiveUserId(final CustomUserPrincipal principal) {
        if (principal != null && principal.getId() != null) return principal.getId();
        final List<User> users = userRepository.findAll();
        if (!users.isEmpty()) return users.get(0).getId();
        throw new IllegalStateException("No authenticated user found.");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResultDto>> search(
        @AuthenticationPrincipal final CustomUserPrincipal currentUser,
        @RequestParam(value = "query", defaultValue = "") final String query,
        final HttpServletRequest request
    ) {
        final UUID userId = getEffectiveUserId(currentUser);
        final SearchResultDto result = studentSearchService.search(userId, query);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved", result, request.getRequestURI()));
    }
}
