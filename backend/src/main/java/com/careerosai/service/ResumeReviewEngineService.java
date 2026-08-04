package com.careerosai.service;

import com.careerosai.dto.ResumeReviewResponseDto;
import org.springframework.web.multipart.MultipartFile;

public interface ResumeReviewEngineService {
    ResumeReviewResponseDto reviewResume(MultipartFile file);
}
