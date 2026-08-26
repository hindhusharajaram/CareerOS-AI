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
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiCareerChatController {

    @Value("${GROQ_API_KEY:${groq.api.key:}}")
    private String groqApiKey;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> handleCareerChat(@RequestBody Map<String, String> payload) {
        String userMessage = payload != null ? payload.get("message") : null;
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("reply", "Please enter a valid message."));
        }

        if (groqApiKey == null || groqApiKey.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "reply", "Groq API key is missing on the server. Please add GROQ_API_KEY in Render Environment Variables."
            ));
        }

        final String apiKey = Objects.requireNonNull(groqApiKey.trim());
        final List<String> candidateModels = List.of(
            "groq/compound",
            "groq/compound-mini",
            "openai/gpt-oss-120b",
            "qwen/qwen3.6-27b"
        );

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String lastErrorMsg = null;

        for (String model : candidateModels) {
            try {
                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("model", model);
                requestBody.put("messages", List.of(
                    Map.of("role", "system", "content", "You are CareerOS AI, an elite technical career advisor for engineering students."),
                    Map.of("role", "user", "content", userMessage)
                ));

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
                Map<?, ?> response = restTemplate.postForObject(url, entity, Map.class);

                if (response != null && response.containsKey("choices")) {
                    Object choicesObj = response.get("choices");
                    if (choicesObj instanceof List<?> choices && !choices.isEmpty()) {
                        Object firstChoiceObj = choices.get(0);
                        if (firstChoiceObj instanceof Map<?, ?> firstChoice) {
                            Object messageObj = firstChoice.get("message");
                            if (messageObj instanceof Map<?, ?> message) {
                                Object contentObj = message.get("content");
                                if (contentObj instanceof String replyText && !replyText.trim().isEmpty()) {
                                    return ResponseEntity.ok(Map.of("reply", replyText));
                                }
                            }
                        }
                    }
                }
            } catch (HttpStatusCodeException e) {
                lastErrorMsg = "Groq API Error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString();
            } catch (Exception e) {
                lastErrorMsg = "Groq Communication Error: " + e.getMessage();
            }
        }

        return ResponseEntity.ok(Map.of("reply", lastErrorMsg != null ? lastErrorMsg : "No response from AI models."));
    }
}
