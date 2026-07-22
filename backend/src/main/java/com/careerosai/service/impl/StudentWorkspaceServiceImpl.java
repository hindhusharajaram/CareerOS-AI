package com.careerosai.service.impl;

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
import com.careerosai.entity.CareerGoal;
import com.careerosai.entity.Certificate;
import com.careerosai.entity.Education;
import com.careerosai.entity.Experience;
import com.careerosai.entity.Project;
import com.careerosai.entity.Skill;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.StudentSkill;
import com.careerosai.entity.User;
import com.careerosai.exception.ResourceNotFoundException;
import com.careerosai.mapper.StudentProfileMapper;
import com.careerosai.repository.CareerGoalRepository;
import com.careerosai.repository.CertificateRepository;
import com.careerosai.repository.EducationRepository;
import com.careerosai.repository.ExperienceRepository;
import com.careerosai.repository.ProjectRepository;
import com.careerosai.repository.SkillRepository;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.StudentSkillRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.service.StudentWorkspaceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentWorkspaceServiceImpl implements StudentWorkspaceService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final EducationRepository educationRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;
    private final ExperienceRepository experienceRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final StudentProfileMapper studentProfileMapper;

    @Override
    @Transactional
    public StudentProfileDto getProfileByUserId(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return studentProfileMapper.toDto(profile);
    }

    @Override
    @Transactional
    public StudentProfileDto updateProfile(final UUID userId, final StudentProfileDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);

        if (dto.getFirstName() != null) profile.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) profile.setLastName(dto.getLastName());
        if (dto.getProfilePhoto() != null) profile.setProfilePhoto(dto.getProfilePhoto());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) profile.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getCity() != null) profile.setCity(dto.getCity());
        if (dto.getState() != null) profile.setState(dto.getState());
        if (dto.getCountry() != null) profile.setCountry(dto.getCountry());
        if (dto.getUniversityName() != null) profile.setUniversityName(dto.getUniversityName());
        if (dto.getDegree() != null) profile.setDegree(dto.getDegree());
        if (dto.getMajor() != null) profile.setMajor(dto.getMajor());
        if (dto.getBranch() != null) profile.setBranch(dto.getBranch());
        if (dto.getGpa() != null) profile.setGpa(dto.getGpa());
        if (dto.getGraduationYear() != null) profile.setGraduationYear(dto.getGraduationYear());
        if (dto.getCurrentSemester() != null) profile.setCurrentSemester(dto.getCurrentSemester());
        if (dto.getAbout() != null) profile.setAbout(dto.getAbout());
        if (dto.getLinkedin() != null) profile.setLinkedin(dto.getLinkedin());
        if (dto.getGithub() != null) profile.setGithub(dto.getGithub());
        if (dto.getPortfolio() != null) profile.setPortfolio(dto.getPortfolio());

        final StudentProfile saved = studentProfileRepository.save(profile);
        return studentProfileMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardSummaryDto getDashboardSummary(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final UUID profileId = profile.getId();

        final long skillsCount = studentSkillRepository.countByStudentProfileId(profileId);
        final long eduCount = educationRepository.countByStudentProfileId(profileId);
        final long projCount = projectRepository.countByStudentProfileId(profileId);
        final long certCount = certificateRepository.countByStudentProfileId(profileId);
        final long expCount = experienceRepository.countByStudentProfileId(profileId);
        final Optional<CareerGoal> goalOpt = careerGoalRepository.findByStudentProfileId(profileId);

        // Completion Engine
        final Map<String, Integer> breakdown = new LinkedHashMap<>();
        
        // Personal Details (20%)
        int personalScore = 0;
        if (profile.getFirstName() != null && !profile.getFirstName().isBlank()) personalScore += 4;
        if (profile.getPhone() != null && !profile.getPhone().isBlank()) personalScore += 4;
        if (profile.getCity() != null || profile.getCountry() != null) personalScore += 4;
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) personalScore += 4;
        if (profile.getLinkedin() != null || profile.getGithub() != null || profile.getPortfolio() != null) personalScore += 4;
        breakdown.put("Personal Details", personalScore);

        // Education (15%)
        int eduScore = (eduCount > 0 || (profile.getUniversityName() != null && profile.getDegree() != null)) ? 15 : 0;
        breakdown.put("Education", eduScore);

        // Skills (20%)
        int skillScore = skillsCount > 0 ? (skillsCount >= 3 ? 20 : 10) : 0;
        breakdown.put("Skills", skillScore);

        // Projects (15%)
        int projScore = projCount > 0 ? (projCount >= 2 ? 15 : 10) : 0;
        breakdown.put("Projects", projScore);

        // Certificates (10%)
        int certScore = certCount > 0 ? 10 : 0;
        breakdown.put("Certificates", certScore);

        // Experience (10%)
        int expScore = expCount > 0 ? 10 : 0;
        breakdown.put("Experience", expScore);

        // Career Goal (10%)
        int goalScore = goalOpt.isPresent() && goalOpt.get().getPreferredRole() != null ? 10 : 0;
        breakdown.put("Career Goal", goalScore);

        final int totalCompletion = breakdown.values().stream().mapToInt(Integer::intValue).sum();

        final List<String> recentActivity = new ArrayList<>();
        recentActivity.add("Account authenticated successfully");
        if (skillsCount > 0) recentActivity.add("Added " + skillsCount + " skills to workspace");
        if (projCount > 0) recentActivity.add("Added " + projCount + " projects to portfolio");

        return StudentDashboardSummaryDto.builder()
            .profile(studentProfileMapper.toDto(profile))
            .completionPercentage(Math.min(100, totalCompletion))
            .completionBreakdown(breakdown)
            .skillsCount(skillsCount)
            .educationCount(eduCount)
            .projectsCount(projCount)
            .certificatesCount(certCount)
            .experienceCount(expCount)
            .careerGoal(goalOpt.map(this::toCareerGoalDto).orElse(null))
            .recentActivity(recentActivity)
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getAllAvailableSkills() {
        return skillRepository.findAll().stream()
            .map(s -> SkillDto.builder()
                .id(s.getId())
                .skillName(s.getSkillName())
                .category(s.getCategory())
                .icon(s.getIcon())
                .build())
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentSkillDto> getStudentSkills(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return studentSkillRepository.findByStudentProfileId(profile.getId()).stream()
            .map(this::toStudentSkillDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentSkillDto addStudentSkill(final UUID userId, final AddStudentSkillRequest request) {
        final StudentProfile profile = getOrCreateProfile(userId);
        
        final Skill skill = skillRepository.findBySkillNameIgnoreCase(request.getSkillName())
            .orElseGet(() -> skillRepository.save(Skill.builder()
                .skillName(request.getSkillName())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .icon(request.getIcon() != null ? request.getIcon() : "code")
                .build()));

        final Optional<StudentSkill> existing = studentSkillRepository.findByStudentProfileIdAndSkillId(profile.getId(), skill.getId());
        StudentSkill entity;
        if (existing.isPresent()) {
            entity = existing.get();
            entity.setProficiency(request.getProficiency());
            if (request.getYearsOfExperience() != null) entity.setYearsOfExperience(request.getYearsOfExperience());
        } else {
            entity = StudentSkill.builder()
                .studentProfile(profile)
                .skill(skill)
                .proficiency(request.getProficiency())
                .yearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 1.0)
                .build();
        }

        final StudentSkill saved = studentSkillRepository.save(entity);
        return toStudentSkillDto(saved);
    }

    @Override
    @Transactional
    public void removeStudentSkill(final UUID userId, final UUID skillId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        studentSkillRepository.deleteByStudentProfileIdAndSkillId(profile.getId(), skillId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EducationDto> getEducationList(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return educationRepository.findByStudentProfileIdOrderByStartYearDesc(profile.getId()).stream()
            .map(this::toEducationDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EducationDto addEducation(final UUID userId, final EducationDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final Education edu = Education.builder()
            .studentProfile(profile)
            .institution(dto.getInstitution())
            .degree(dto.getDegree())
            .specialization(dto.getSpecialization())
            .startYear(dto.getStartYear())
            .endYear(dto.getEndYear())
            .cgpa(dto.getCgpa())
            .build();
        return toEducationDto(educationRepository.save(edu));
    }

    @Override
    @Transactional
    public EducationDto updateEducation(final UUID userId, final UUID educationId, final EducationDto dto) {
        final Education edu = educationRepository.findById(educationId)
            .orElseThrow(() -> new ResourceNotFoundException("Education", "id", educationId));
        if (dto.getInstitution() != null) edu.setInstitution(dto.getInstitution());
        if (dto.getDegree() != null) edu.setDegree(dto.getDegree());
        if (dto.getSpecialization() != null) edu.setSpecialization(dto.getSpecialization());
        if (dto.getStartYear() != null) edu.setStartYear(dto.getStartYear());
        if (dto.getEndYear() != null) edu.setEndYear(dto.getEndYear());
        if (dto.getCgpa() != null) edu.setCgpa(dto.getCgpa());
        return toEducationDto(educationRepository.save(edu));
    }

    @Override
    @Transactional
    public void deleteEducation(final UUID userId, final UUID educationId) {
        educationRepository.deleteById(educationId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDto> getProjectsList(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return projectRepository.findByStudentProfileId(profile.getId()).stream()
            .map(this::toProjectDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectDto addProject(final UUID userId, final ProjectDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final Project proj = Project.builder()
            .studentProfile(profile)
            .title(dto.getTitle())
            .description(dto.getDescription())
            .technologies(dto.getTechnologies())
            .githubLink(dto.getGithubLink())
            .liveLink(dto.getLiveLink())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .build();
        return toProjectDto(projectRepository.save(proj));
    }

    @Override
    @Transactional
    public ProjectDto updateProject(final UUID userId, final UUID projectId, final ProjectDto dto) {
        final Project proj = projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        if (dto.getTitle() != null) proj.setTitle(dto.getTitle());
        if (dto.getDescription() != null) proj.setDescription(dto.getDescription());
        if (dto.getTechnologies() != null) proj.setTechnologies(dto.getTechnologies());
        if (dto.getGithubLink() != null) proj.setGithubLink(dto.getGithubLink());
        if (dto.getLiveLink() != null) proj.setLiveLink(dto.getLiveLink());
        if (dto.getStartDate() != null) proj.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) proj.setEndDate(dto.getEndDate());
        return toProjectDto(projectRepository.save(proj));
    }

    @Override
    @Transactional
    public void deleteProject(final UUID userId, final UUID projectId) {
        projectRepository.deleteById(projectId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificateDto> getCertificatesList(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return certificateRepository.findByStudentProfileId(profile.getId()).stream()
            .map(this::toCertificateDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CertificateDto addCertificate(final UUID userId, final CertificateDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final Certificate cert = Certificate.builder()
            .studentProfile(profile)
            .title(dto.getTitle())
            .provider(dto.getProvider())
            .issueDate(dto.getIssueDate())
            .credentialUrl(dto.getCredentialUrl())
            .build();
        return toCertificateDto(certificateRepository.save(cert));
    }

    @Override
    @Transactional
    public CertificateDto updateCertificate(final UUID userId, final UUID certificateId, final CertificateDto dto) {
        final Certificate cert = certificateRepository.findById(certificateId)
            .orElseThrow(() -> new ResourceNotFoundException("Certificate", "id", certificateId));
        if (dto.getTitle() != null) cert.setTitle(dto.getTitle());
        if (dto.getProvider() != null) cert.setProvider(dto.getProvider());
        if (dto.getIssueDate() != null) cert.setIssueDate(dto.getIssueDate());
        if (dto.getCredentialUrl() != null) cert.setCredentialUrl(dto.getCredentialUrl());
        return toCertificateDto(certificateRepository.save(cert));
    }

    @Override
    @Transactional
    public void deleteCertificate(final UUID userId, final UUID certificateId) {
        certificateRepository.deleteById(certificateId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceDto> getExperienceList(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return experienceRepository.findByStudentProfileId(profile.getId()).stream()
            .map(this::toExperienceDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExperienceDto addExperience(final UUID userId, final ExperienceDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final Experience exp = Experience.builder()
            .studentProfile(profile)
            .company(dto.getCompany())
            .role(dto.getRole())
            .description(dto.getDescription())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .build();
        return toExperienceDto(experienceRepository.save(exp));
    }

    @Override
    @Transactional
    public ExperienceDto updateExperience(final UUID userId, final UUID experienceId, final ExperienceDto dto) {
        final Experience exp = experienceRepository.findById(experienceId)
            .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", experienceId));
        if (dto.getCompany() != null) exp.setCompany(dto.getCompany());
        if (dto.getRole() != null) exp.setRole(dto.getRole());
        if (dto.getDescription() != null) exp.setDescription(dto.getDescription());
        if (dto.getStartDate() != null) exp.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) exp.setEndDate(dto.getEndDate());
        return toExperienceDto(experienceRepository.save(exp));
    }

    @Override
    @Transactional
    public void deleteExperience(final UUID userId, final UUID experienceId) {
        experienceRepository.deleteById(experienceId);
    }

    @Override
    @Transactional(readOnly = true)
    public CareerGoalDto getCareerGoal(final UUID userId) {
        final StudentProfile profile = getOrCreateProfile(userId);
        return careerGoalRepository.findByStudentProfileId(profile.getId())
            .map(this::toCareerGoalDto)
            .orElse(null);
    }

    @Override
    @Transactional
    public CareerGoalDto updateCareerGoal(final UUID userId, final CareerGoalDto dto) {
        final StudentProfile profile = getOrCreateProfile(userId);
        final CareerGoal goal = careerGoalRepository.findByStudentProfileId(profile.getId())
            .orElseGet(() -> CareerGoal.builder().studentProfile(profile).build());

        if (dto.getPreferredRole() != null) goal.setPreferredRole(dto.getPreferredRole());
        if (dto.getPreferredDomain() != null) goal.setPreferredDomain(dto.getPreferredDomain());
        if (dto.getPreferredLocation() != null) goal.setPreferredLocation(dto.getPreferredLocation());
        if (dto.getExpectedSalary() != null) goal.setExpectedSalary(dto.getExpectedSalary());
        if (dto.getHigherStudies() != null) goal.setHigherStudies(dto.getHigherStudies());
        if (dto.getTargetCompanies() != null) goal.setTargetCompanies(dto.getTargetCompanies());
        if (dto.getWorkMode() != null) goal.setWorkMode(dto.getWorkMode());

        return toCareerGoalDto(careerGoalRepository.save(goal));
    }

    private StudentProfile getOrCreateProfile(final UUID userId) {
        return studentProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                final User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                String fName = "Student";
                String lName = "User";
                if (user.getFullName() != null && !user.getFullName().isBlank()) {
                    String[] parts = user.getFullName().split(" ", 2);
                    fName = parts[0];
                    if (parts.length > 1) lName = parts[1];
                }
                return studentProfileRepository.save(StudentProfile.builder()
                    .user(user)
                    .firstName(fName)
                    .lastName(lName)
                    .universityName("CareerOS University")
                    .major("Computer Science")
                    .graduationYear(2026)
                    .build());
            });
    }

    private StudentSkillDto toStudentSkillDto(final StudentSkill s) {
        return StudentSkillDto.builder()
            .id(s.getId())
            .studentId(s.getStudentProfile().getId())
            .skillId(s.getSkill().getId())
            .skillName(s.getSkill().getSkillName())
            .category(s.getSkill().getCategory())
            .icon(s.getSkill().getIcon())
            .proficiency(s.getProficiency())
            .yearsOfExperience(s.getYearsOfExperience())
            .build();
    }

    private EducationDto toEducationDto(final Education e) {
        return EducationDto.builder()
            .id(e.getId())
            .studentId(e.getStudentProfile().getId())
            .institution(e.getInstitution())
            .degree(e.getDegree())
            .specialization(e.getSpecialization())
            .startYear(e.getStartYear())
            .endYear(e.getEndYear())
            .cgpa(e.getCgpa())
            .build();
    }

    private ProjectDto toProjectDto(final Project p) {
        return ProjectDto.builder()
            .id(p.getId())
            .studentId(p.getStudentProfile().getId())
            .title(p.getTitle())
            .description(p.getDescription())
            .technologies(p.getTechnologies())
            .githubLink(p.getGithubLink())
            .liveLink(p.getLiveLink())
            .startDate(p.getStartDate())
            .endDate(p.getEndDate())
            .build();
    }

    private CertificateDto toCertificateDto(final Certificate c) {
        return CertificateDto.builder()
            .id(c.getId())
            .studentId(c.getStudentProfile().getId())
            .title(c.getTitle())
            .provider(c.getProvider())
            .issueDate(c.getIssueDate())
            .credentialUrl(c.getCredentialUrl())
            .build();
    }

    private ExperienceDto toExperienceDto(final Experience e) {
        return ExperienceDto.builder()
            .id(e.getId())
            .studentId(e.getStudentProfile().getId())
            .company(e.getCompany())
            .role(e.getRole())
            .description(e.getDescription())
            .startDate(e.getStartDate())
            .endDate(e.getEndDate())
            .build();
    }

    private CareerGoalDto toCareerGoalDto(final CareerGoal g) {
        return CareerGoalDto.builder()
            .id(g.getId())
            .studentId(g.getStudentProfile().getId())
            .preferredRole(g.getPreferredRole())
            .preferredDomain(g.getPreferredDomain())
            .preferredLocation(g.getPreferredLocation())
            .expectedSalary(g.getExpectedSalary())
            .higherStudies(g.getHigherStudies())
            .targetCompanies(g.getTargetCompanies())
            .workMode(g.getWorkMode())
            .build();
    }
}
