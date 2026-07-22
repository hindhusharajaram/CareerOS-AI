package com.careerosai.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIChatMessageDto {
    private UUID id;
    private UUID sessionId;
    private String senderRole; // USER, AI
    private String messageText;
    private LocalDateTime createdAt;
}
