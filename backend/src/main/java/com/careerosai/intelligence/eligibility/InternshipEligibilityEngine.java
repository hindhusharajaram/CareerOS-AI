package com.careerosai.intelligence.eligibility;

import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.StudentSkill;
import com.careerosai.intelligence.dto.EligibilityReportDto;
import com.careerosai.repository.EducationRepository;
import com.careerosai.repository.ProjectRepository;
import com.careerosai.repository.StudentSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InternshipEligibilityEngine {

    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;

    public EligibilityReportDto evaluateEligibility(final StudentProfile profile) {
        final UUID profileId = profile.getId();

        final Set<String> userSkills = studentSkillRepository.findByStudentProfileId(profileId).stream()
            .map(s -> s.getSkill().getSkillName().toUpperCase())
            .collect(Collectors.toSet());

        final long projCount = projectRepository.countByStudentProfileId(profileId);
        final double gpa = profile.getGpa() != null ? profile.getGpa().doubleValue() : 7.0;
        final int gradYear = profile.getGraduationYear() != null ? profile.getGraduationYear() : 2026;

        final List<EligibilityReportDto.CompanyEligibility> list = new ArrayList<>();

        // 1. Google STEP
        list.add(evalCompany("Google", "Google STEP Internship", gradYear >= 2026 && (gpa >= 3.0 || gpa >= 7.5), userSkills.contains("JAVA") || userSkills.contains("PYTHON") || userSkills.contains("C++"), projCount >= 1, "Requires CS major, 2026/2027 grad year, and Python/Java proficiency."));

        // 2. Microsoft Explore
        list.add(evalCompany("Microsoft", "Microsoft Explore Program", gradYear >= 2026 && (gpa >= 3.0 || gpa >= 7.5), userSkills.contains("JAVA") || userSkills.contains("PYTHON") || userSkills.contains("REACT"), projCount >= 1, "Targeted at 1st and 2nd year students with solid coding fundamentals."));

        // 3. Amazon WOW
        list.add(evalCompany("Amazon", "Amazon WOW Tech Program", true, userSkills.contains("JAVA") || userSkills.contains("DATA STRUCTURES") || userSkills.contains("SQL"), projCount >= 1, "Focuses on Data Structures, Algorithms, and System Object-Oriented Design."));

        // 4. Adobe
        list.add(evalCompany("Adobe", "Adobe Women in Tech / Intern", (gpa >= 3.2 || gpa >= 8.0), userSkills.contains("PYTHON") || userSkills.contains("REACT") || userSkills.contains("JAVA"), projCount >= 2, "High academic threshold (CGPA >= 8.0) and strong portfolio projects."));

        // 5. JP Morgan
        list.add(evalCompany("JP Morgan", "Software Engineer Program", (gpa >= 3.0 || gpa >= 7.0), userSkills.contains("JAVA") || userSkills.contains("PYTHON") || userSkills.contains("SQL"), projCount >= 1, "Requires Java/Python and Financial Tech domain knowledge."));

        // 6. Goldman Sachs
        list.add(evalCompany("Goldman Sachs", "Engineering Campus Hiring", (gpa >= 3.2 || gpa >= 8.0), userSkills.contains("JAVA") || userSkills.contains("DATA STRUCTURES") || userSkills.contains("C++"), projCount >= 1, "Rigorous Data Structures & Quantitative Problem Solving focus."));

        // 7. TCS
        list.add(evalCompany("TCS", "TCS Digital / Ninja", (gpa >= 2.8 || gpa >= 6.5), userSkills.contains("JAVA") || userSkills.contains("PYTHON") || userSkills.contains("SQL"), true, "Open for 2024-2026 graduates with no active backlogs."));

        // 8. Infosys
        list.add(evalCompany("Infosys", "HackWithInfy / Specialist Programmer", true, userSkills.contains("JAVA") || userSkills.contains("PYTHON"), projCount >= 1, "Competitive coding evaluation with hands-on development focus."));

        // 9. Accenture
        list.add(evalCompany("Accenture", "Advanced App Engineering Analyst", (gpa >= 2.8 || gpa >= 6.5), userSkills.contains("REACT") || userSkills.contains("JAVA") || userSkills.contains("SQL"), true, "Basic cloud and application development assessment."));

        // 10. Wells Fargo
        list.add(evalCompany("Wells Fargo", "Technology Campus Analyst", (gpa >= 3.0 || gpa >= 7.5), userSkills.contains("JAVA") || userSkills.contains("SPRING BOOT") || userSkills.contains("SQL"), projCount >= 1, "Prefers Enterprise Java & Spring Boot backend skills."));

        // 11. Deloitte
        list.add(evalCompany("Deloitte", "USI Tech Consultant Intern", (gpa >= 3.0 || gpa >= 7.0), userSkills.contains("SQL") || userSkills.contains("PYTHON") || userSkills.contains("REST APIS"), true, "Consulting & Technical integration focus."));

        return EligibilityReportDto.builder().evaluations(list).build();
    }

    private EligibilityReportDto.CompanyEligibility evalCompany(
        final String company,
        final String program,
        final boolean academicMet,
        final boolean skillMet,
        final boolean projectMet,
        final String note
    ) {
        final List<String> met = new ArrayList<>();
        final List<String> missing = new ArrayList<>();

        if (academicMet) met.add("Academic CGPA & Graduation Year Criteria Met"); else missing.add("CGPA or Graduation Year out of target range");
        if (skillMet) met.add("Required Core Skills Verified"); else missing.add("Missing required core skills (Java/Python/DSA)");
        if (projectMet) met.add("Minimum Project Count Met"); else missing.add("Needs at least 1 verified portfolio project");

        String status = "ELIGIBLE";
        if (missing.size() == 1) status = "NEARLY_ELIGIBLE";
        else if (missing.size() > 1) status = "NOT_ELIGIBLE";

        return EligibilityReportDto.CompanyEligibility.builder()
            .companyName(company)
            .programName(program)
            .status(status)
            .explanation(note)
            .metCriteria(met)
            .missingCriteria(missing)
            .build();
    }
}
