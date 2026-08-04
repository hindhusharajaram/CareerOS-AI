package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing bullet point metric quantification audit.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuantificationBulletDto {
    private String currentBullet;
    private String status; // "Quantified", "Needs Quantification"
    private String suggestion;
}
