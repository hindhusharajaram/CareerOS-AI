package com.careerosai.service;

import com.careerosai.dto.CertificateDto;
import com.careerosai.dto.EducationDto;
import com.careerosai.dto.ExperienceDto;
import com.careerosai.dto.ProjectDto;
import com.careerosai.dto.SearchResultDto;
import com.careerosai.dto.StudentSkillDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentSearchService {

    private final StudentWorkspaceService studentWorkspaceService;

    public SearchResultDto search(final UUID userId, final String query) {
        if (query == null || query.isBlank()) {
            return SearchResultDto.builder().query(query).build();
        }

        final String q = query.toLowerCase().trim();

        final List<StudentSkillDto> skills = studentWorkspaceService.getStudentSkills(userId).stream()
            .filter(s -> s.getSkillName().toLowerCase().contains(q) || (s.getCategory() != null && s.getCategory().toLowerCase().contains(q)))
            .collect(Collectors.toList());

        final List<ProjectDto> projects = studentWorkspaceService.getProjectsList(userId).stream()
            .filter(p -> p.getTitle().toLowerCase().contains(q) || p.getDescription().toLowerCase().contains(q) || (p.getTechnologies() != null && p.getTechnologies().toLowerCase().contains(q)))
            .collect(Collectors.toList());

        final List<CertificateDto> certificates = studentWorkspaceService.getCertificatesList(userId).stream()
            .filter(c -> c.getTitle().toLowerCase().contains(q) || c.getProvider().toLowerCase().contains(q))
            .collect(Collectors.toList());

        final List<ExperienceDto> experience = studentWorkspaceService.getExperienceList(userId).stream()
            .filter(e -> e.getCompany().toLowerCase().contains(q) || e.getRole().toLowerCase().contains(q) || (e.getDescription() != null && e.getDescription().toLowerCase().contains(q)))
            .collect(Collectors.toList());

        final List<EducationDto> education = studentWorkspaceService.getEducationList(userId).stream()
            .filter(e -> e.getInstitution().toLowerCase().contains(q) || e.getDegree().toLowerCase().contains(q) || (e.getSpecialization() != null && e.getSpecialization().toLowerCase().contains(q)))
            .collect(Collectors.toList());

        return SearchResultDto.builder()
            .query(query)
            .matchingSkills(skills)
            .matchingProjects(projects)
            .matchingCertificates(certificates)
            .matchingExperience(experience)
            .matchingEducation(education)
            .build();
    }
}
