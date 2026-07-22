package com.careerosai.intelligence.roadmap;

import com.careerosai.entity.CareerGoal;
import com.careerosai.entity.StudentProfile;
import com.careerosai.intelligence.dto.CareerRoadmapDto;
import com.careerosai.repository.CareerGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CareerRoadmapEngine {

    private final CareerGoalRepository careerGoalRepository;

    public CareerRoadmapDto generateRoadmap(final StudentProfile profile) {
        final UUID profileId = profile.getId();
        final Optional<CareerGoal> goalOpt = careerGoalRepository.findByStudentProfileId(profileId);

        final String targetRole = goalOpt.isPresent() && goalOpt.get().getPreferredRole() != null
            ? goalOpt.get().getPreferredRole()
            : "Software Engineer";

        // 30-Day Roadmap (Weeks 1 - 4)
        final List<CareerRoadmapDto.RoadmapTask> day30 = new ArrayList<>();
        day30.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 1").title("Core Skill Foundation").description("Master core syntax and data structures in " + targetRole + " stack.").category("Skills").isCompleted(true).build());
        day30.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 2").title("REST API & Database Design").description("Build normalized PostgreSQL database schemas and REST endpoints.").category("Backend").isCompleted(false).build());
        day30.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 3").title("Portfolio Project Alpha").description("Build and commit a full-stack project to GitHub with comprehensive README.").category("Projects").isCompleted(false).build());
        day30.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 4").title("Resume & ATS Optimization").description("Upload PDF resume and optimize ATS keyword density.").category("Resume").isCompleted(false).build());

        // 60-Day Roadmap (Weeks 5 - 8)
        final List<CareerRoadmapDto.RoadmapTask> day60 = new ArrayList<>();
        day60.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 5").title("Advanced Algorithms & LeetCode").description("Solve 20+ Medium Data Structures & Algorithms problems.").category("CS Fundamentals").isCompleted(false).build());
        day60.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 6").title("Docker & Cloud Deployment").description("Containerize your application with Docker and deploy to AWS / Render.").category("DevOps").isCompleted(false).build());
        day60.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 7").title("Industry Certification").description("Complete AWS Certified Developer or Coursera specialization.").category("Certification").isCompleted(false).build());
        day60.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 8").title("System Design & Architecture").description("Learn microservices, caching with Redis, and queue architectures.").category("System Design").isCompleted(false).build());

        // 90-Day Roadmap (Weeks 9 - 12)
        final List<CareerRoadmapDto.RoadmapTask> day90 = new ArrayList<>();
        day90.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 9").title("Targeted Internship Applications").description("Apply to 15+ companies aligned with target role and work mode.").category("Job Applications").isCompleted(false).build());
        day90.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 10").title("Mock Technical Interviews").description("Conduct 3 peer technical mock interviews focusing on live coding.").category("Interviews").isCompleted(false).build());
        day90.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 11").title("Open Source Contribution").description("Submit a pull request to a popular open-source repository.").category("Community").isCompleted(false).build());
        day90.add(CareerRoadmapDto.RoadmapTask.builder().week("Week 12").title("Final Career Readiness Audit").description("Verify 900+ Career Score and top placement eligibility.").category("Placement").isCompleted(false).build());

        return CareerRoadmapDto.builder()
            .targetRole(targetRole)
            .day30Roadmap(day30)
            .day60Roadmap(day60)
            .day90Roadmap(day90)
            .build();
    }
}
