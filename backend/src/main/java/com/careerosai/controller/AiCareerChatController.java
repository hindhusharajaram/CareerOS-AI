package com.careerosai.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiCareerChatController {

    @Value("${spring.ai.openai.api-key:${OPENAI_API_KEY:}}")
    private String openAiApiKey;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithGpt(@RequestBody Map<String, String> payload) {
        String userMessage = payload != null ? payload.get("message") : null;
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Please provide a valid prompt."));
        }

        // If no API key is present, fallback gracefully with a clear message
        if (openAiApiKey == null || openAiApiKey.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("reply", "OpenAI API Key is missing on the server. Please set OPENAI_API_KEY in Render environment variables."));
        }

        final String apiKey = Objects.requireNonNull(openAiApiKey.trim());

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("messages", List.of(
                Map.of("role", "system", "content", "You are CareerOS AI, an expert technical career coach helping engineering students with resumes, career scores, and interview prep."),
                Map.of("role", "user", "content", userMessage)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);

            if (response != null && response.containsKey("choices")) {
                Object choicesObj = response.get("choices");
                if (choicesObj instanceof List<?> choices && !choices.isEmpty()) {
                    Object firstChoiceObj = choices.get(0);
                    if (firstChoiceObj instanceof Map<?, ?> firstChoice) {
                        Object messageObj = firstChoice.get("message");
                        if (messageObj instanceof Map<?, ?> message) {
                            Object contentObj = message.get("content");
                            if (contentObj instanceof String replyText) {
                                return ResponseEntity.ok(Map.of("reply", replyText));
                            }
                        }
                    }
                }
            }

            return ResponseEntity.status(500).body(Map.of("reply", "Invalid response received from ChatGPT API."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("reply", "Error communicating with ChatGPT: " + e.getMessage()));
        }
    }
}
