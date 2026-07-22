package com.careerosai.intelligence.scoring;

import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.CareerScoreDto;
import com.careerosai.repository.CertificateRepository;
import com.careerosai.repository.EducationRepository;
import com.careerosai.repository.ExperienceRepository;
import com.careerosai.repository.ProjectRepository;
import com.careerosai.repository.ResumeRepository;
import com.careerosai.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CareerScoreEngine {

    private final StudentSkillRepository studentSkillRepository;
    private final EducationRepository educationRepository;
    private final ProjectRepository projectRepository;
    private final CertificateRepository certificateRepository;
    private final ExperienceRepository experienceRepository;
    private final ResumeRepository resumeRepository;

    public CareerScoreDto calculateScore(final StudentProfile profile) {
        final UUID profileId = profile.getId();

        final long skillsCount = studentSkillRepository.countByStudentProfileId(profileId);
        final long eduCount = educationRepository.countByStudentProfileId(profileId);
        final long projCount = projectRepository.countByStudentProfileId(profileId);
        final long certCount = certificateRepository.countByStudentProfileId(profileId);
        final long expCount = experienceRepository.countByStudentProfileId(profileId);
        final long resumeCount = resumeRepository.countByStudentProfileId(profileId);

        final Map<String, Integer> categoryScores = new LinkedHashMap<>();
        final List<String> strengths = new ArrayList<>();
        final List<String> weaknesses = new ArrayList<>();
        final List<String> improvementAreas = new ArrayList<>();

        // 1. Profile Completeness (15% = 150 pts)
        int profileScore = 0;
        if (profile.getFirstName() != null && !profile.getFirstName().isBlank()) profileScore += 30;
        if (profile.getPhone() != null && !profile.getPhone().isBlank()) profileScore += 30;
        if (profile.getCity() != null || profile.getCountry() != null) profileScore += 30;
        if (profile.getAbout() != null && !profile.getAbout().isBlank()) profileScore += 30;
        if (profile.getUniversityName() != null) profileScore += 30;
        categoryScores.put("Profile Completeness", Math.min(150, profileScore));

        // 2. Projects (20% = 200 pts)
        int projScore = (int) Math.min(200, projCount * 100);
        categoryScores.put("Projects", projScore);
        if (projCount >= 2) strengths.add("Strong project portfolio (" + projCount + " projects)");
        else {
            weaknesses.add("Limited project exposure");
            improvementAreas.add("Build at least 2 full-stack or AI projects with GitHub repositories.");
        }

        // 3. Skills (20% = 200 pts)
        int skillScore = (int) Math.min(200, skillsCount * 40);
        categoryScores.put("Skills Matrix", skillScore);
        if (skillsCount >= 5) strengths.add("Diverse technical skills matrix (" + skillsCount + " skills)");
        else {
            weaknesses.add("Underpopulated skill matrix");
            improvementAreas.add("Add core skills and frameworks to your profile.");
        }

        // 4. Experience (15% = 150 pts)
        int expScore = (int) Math.min(150, expCount * 150);
        categoryScores.put("Experience", expScore);
        if (expCount >= 1) strengths.add("Practical work / internship experience");
        else improvementAreas.add("Apply for internships or open-source research roles.");

        // 5. Education (10% = 100 pts)
        int eduScore = (eduCount > 0 || profile.getUniversityName() != null) ? 100 : 50;
        categoryScores.put("Education", eduScore);

        // 6. Certificates (10% = 100 pts)
        int certScore = (int) Math.min(100, certCount * 50);
        categoryScores.put("Certificates", certScore);
        if (certCount >= 2) strengths.add("Verified industry certifications");

        // 7. Resume Quality (5% = 50 pts)
        int resumeScore = resumeCount > 0 ? 50 : 0;
        categoryScores.put("Resume Quality", resumeScore);

        // 8. GitHub Presence (3% = 30 pts)
        int githubScore = (profile.getGithub() != null && !profile.getGithub().isBlank()) ? 30 : 0;
        categoryScores.put("GitHub Presence", githubScore);

        // 9. LinkedIn Presence (2% = 20 pts)
        int linkedinScore = (profile.getLinkedin() != null && !profile.getLinkedin().isBlank()) ? 20 : 0;
        categoryScores.put("LinkedIn Presence", linkedinScore);

        final int overallScore = categoryScores.values().stream().mapToInt(Integer::intValue).sum();

        return CareerScoreDto.builder()
            .overallScore(Math.min(1000, overallScore))
            .categoryScores(categoryScores)
            .strengths(strengths)
            .weaknesses(weaknesses)
            .improvementAreas(improvementAreas)
            .build();
    }
}
