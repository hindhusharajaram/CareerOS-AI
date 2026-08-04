package com.careerosai.service.impl;

import com.careerosai.dto.ResumeReviewResponseDto;
import com.careerosai.facade.ResumeReviewFacade;
import com.careerosai.service.ResumeReviewEngineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ResumeReviewEngineServiceImpl implements ResumeReviewEngineService {

    private final ResumeReviewFacade resumeReviewFacade;

    @Override
    public ResumeReviewResponseDto reviewResume(final MultipartFile file) {
        return resumeReviewFacade.reviewResume(file);
    }
}

