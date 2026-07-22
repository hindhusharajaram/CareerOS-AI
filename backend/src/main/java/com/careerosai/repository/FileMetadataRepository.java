package com.careerosai.repository;

import com.careerosai.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {

    List<FileMetadata> findByStudentProfileId(UUID studentProfileId);

    List<FileMetadata> findByStudentProfileIdAndUploadType(UUID studentProfileId, String uploadType);
}
