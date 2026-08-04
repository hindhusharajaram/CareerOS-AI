package com.careerosai.service;

import com.careerosai.dto.ResumeHealthDto;

/**
 * Service for computing overall Resume Health metrics.
 */
public interface ResumeHealthService {
    ResumeHealthDto evaluateHealth(int overallScore);
}
