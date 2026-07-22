package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardSummaryDto {
    private StudentProfileDto profile;
    private int completionPercentage;
    private Map<String, Integer> completionBreakdown;
    private long skillsCount;
    private long educationCount;
    private long projectsCount;
    private long certificatesCount;
    private long experienceCount;
    private CareerGoalDto careerGoal;
    private List<String> recentActivity;
}
