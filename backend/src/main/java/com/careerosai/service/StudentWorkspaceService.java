package com.careerosai.service;

import com.careerosai.dto.AddStudentSkillRequest;
import com.careerosai.dto.CareerGoalDto;
import com.careerosai.dto.CertificateDto;
import com.careerosai.dto.EducationDto;
import com.careerosai.dto.ExperienceDto;
import com.careerosai.dto.ProjectDto;
import com.careerosai.dto.SkillDto;
import com.careerosai.dto.StudentDashboardSummaryDto;
import com.careerosai.dto.StudentProfileDto;
import com.careerosai.dto.StudentSkillDto;

import java.util.List;
import java.util.UUID;

/**
 * Service Interface managing Student Workspace & Profile Data operations.
 */
public interface StudentWorkspaceService {

    StudentProfileDto getProfileByUserId(UUID userId);

    StudentProfileDto updateProfile(UUID userId, StudentProfileDto dto);

    StudentDashboardSummaryDto getDashboardSummary(UUID userId);

    List<SkillDto> getAllAvailableSkills();

    List<StudentSkillDto> getStudentSkills(UUID userId);

    StudentSkillDto addStudentSkill(UUID userId, AddStudentSkillRequest request);

    void removeStudentSkill(UUID userId, UUID skillId);

    List<EducationDto> getEducationList(UUID userId);

    EducationDto addEducation(UUID userId, EducationDto dto);

    EducationDto updateEducation(UUID userId, UUID educationId, EducationDto dto);

    void deleteEducation(UUID userId, UUID educationId);

    List<ProjectDto> getProjectsList(UUID userId);

    ProjectDto addProject(UUID userId, ProjectDto dto);

    ProjectDto updateProject(UUID userId, UUID projectId, ProjectDto dto);

    void deleteProject(UUID userId, UUID projectId);

    List<CertificateDto> getCertificatesList(UUID userId);

    CertificateDto addCertificate(UUID userId, CertificateDto dto);

    CertificateDto updateCertificate(UUID userId, UUID certificateId, CertificateDto dto);

    void deleteCertificate(UUID userId, UUID certificateId);

    List<ExperienceDto> getExperienceList(UUID userId);

    ExperienceDto addExperience(UUID userId, ExperienceDto dto);

    ExperienceDto updateExperience(UUID userId, UUID experienceId, ExperienceDto dto);

    void deleteExperience(UUID userId, UUID experienceId);

    CareerGoalDto getCareerGoal(UUID userId);

    CareerGoalDto updateCareerGoal(UUID userId, CareerGoalDto dto);
}
