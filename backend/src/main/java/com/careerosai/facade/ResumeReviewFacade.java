package com.careerosai.facade;

import com.careerosai.dto.ResumeReviewResponseDto;
import org.springframework.web.multipart.MultipartFile;

/**
 * Facade interface orchestrating the complete Resume Review pipeline cleanly.
 */
public interface ResumeReviewFacade {
    ResumeReviewResponseDto reviewResume(MultipartFile file);
}
