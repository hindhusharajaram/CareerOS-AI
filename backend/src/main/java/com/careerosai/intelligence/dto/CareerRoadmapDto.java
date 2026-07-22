package com.careerosai.intelligence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerRoadmapDto {

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapTask {
        private String week;
        private String title;
        private String description;
        private String category;
        private boolean isCompleted;
    }

    private String targetRole;
    private List<RoadmapTask> day30Roadmap;
    private List<RoadmapTask> day60Roadmap;
    private List<RoadmapTask> day90Roadmap;
}
