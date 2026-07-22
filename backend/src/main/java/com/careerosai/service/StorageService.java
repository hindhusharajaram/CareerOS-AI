package com.careerosai.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Storage Service Abstraction Interface.
 * Enables seamless switching between Local FileSystem, AWS S3, and Azure Blob Storage.
 */
public interface StorageService {

    String store(MultipartFile file, String subDirectory, String customFileName);

    Resource loadAsResource(String filePath);

    void delete(String filePath);
}
