package com.careerosai.service;

import com.careerosai.dto.ParsedResumeDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * Resume Parser Service Abstraction Interface.
 * Allows rule-based parsing initially and seamless upgrade to AI/LLM models later.
 */
public interface ResumeParserService {

    ParsedResumeDto parseResume(MultipartFile file);

    ParsedResumeDto parseResumeStream(InputStream inputStream, String fileName);
}
