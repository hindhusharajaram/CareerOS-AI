package com.careerosai.warehouse.etl;

import com.careerosai.entity.AnalyticsEvent;
import com.careerosai.entity.EtlExecutionHistory;
import com.careerosai.entity.User;
import com.careerosai.repository.AnalyticsEventRepository;
import com.careerosai.repository.EtlExecutionHistoryRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.warehouse.dimension.DimDate;
import com.careerosai.warehouse.dimension.DimDateRepository;
import com.careerosai.warehouse.dimension.DimFeature;
import com.careerosai.warehouse.dimension.DimFeatureRepository;
import com.careerosai.warehouse.dimension.DimUser;
import com.careerosai.warehouse.dimension.DimUserRepository;
import com.careerosai.warehouse.fact.FactUserActivity;
import com.careerosai.warehouse.fact.FactUserActivityRepository;
import com.careerosai.warehouse.quality.DataQualityEngineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EtlPipelineService {

    private final AnalyticsEventRepository analyticsEventRepository;
    private final UserRepository userRepository;
    private final DimUserRepository dimUserRepository;
    private final DimDateRepository dimDateRepository;
    private final DimFeatureRepository dimFeatureRepository;
    private final FactUserActivityRepository factUserActivityRepository;
    private final EtlExecutionHistoryRepository etlExecutionHistoryRepository;
    private final DataQualityEngineService dataQualityEngineService;

    @Transactional
    public EtlExecutionHistory runIncrementalEtlPipeline() {
        final LocalDateTime startTime = LocalDateTime.now();
        log.info("Starting Incremental ETL Pipeline Run at {}", startTime);

        final EtlExecutionHistory job = etlExecutionHistoryRepository.save(EtlExecutionHistory.builder()
            .pipelineName("INCREMENTAL_EVENTS_ETL")
            .pipelineVersion("v1.0.0")
            .recordsExtracted(0)
            .recordsTransformed(0)
            .recordsLoaded(0)
            .recordsRejected(0)
            .status("RUNNING")
            .startedAt(startTime)
            .build());

        try {
            // 1. EXTRACT: Read operational users and analytics_events
            final List<User> users = userRepository.findAll();
            final List<AnalyticsEvent> events = analyticsEventRepository.findAll();

            job.setRecordsExtracted(users.size() + events.size());

            // 2. TRANSFORM & LOAD DIMENSIONS
            // Ensure DimDate exists for today
            final LocalDate today = LocalDate.now();
            final int dateKey = Integer.parseInt(today.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
            dimDateRepository.findByDateKey(dateKey).orElseGet(() -> dimDateRepository.save(DimDate.builder()
                .dateKey(dateKey)
                .fullDate(today)
                .dayOfWeek(today.getDayOfWeek().name())
                .dayOfMonth(today.getDayOfMonth())
                .monthNumber(today.getMonthValue())
                .monthName(today.getMonth().name())
                .quarter((today.getMonthValue() - 1) / 3 + 1)
                .yearNumber(today.getYear())
                .isWeekend(today.getDayOfWeek().getValue() >= 6)
                .build()));

            for (User u : users) {
                dimUserRepository.findByUserId(u.getId()).orElseGet(() -> dimUserRepository.save(DimUser.builder()
                    .userId(u.getId())
                    .email(u.getEmail())
                    .fullName(u.getFullName())
                    .role(u.getRole() != null ? u.getRole() : "STUDENT")
                    .graduationYear(2025)
                    .build()));
            }

            int loadedCount = 0;
            // 3. TRANSFORM & LOAD FACTS
            for (AnalyticsEvent ev : events) {
                final String evtType = ev.getEventType() != null ? ev.getEventType() : "GENERIC_ACTIVITY";

                final DimFeature feat = dimFeatureRepository.findByFeatureName(evtType)
                    .orElseGet(() -> dimFeatureRepository.save(DimFeature.builder()
                        .featureName(evtType)
                        .module("ANALYTICS")
                        .build()));

                final DimUser dimUser = ev.getUser() != null ? dimUserRepository.findByUserId(ev.getUser().getId()).orElse(null) : null;

                factUserActivityRepository.save(FactUserActivity.builder()
                    .userKey(dimUser != null ? dimUser.getUserKey() : null)
                    .dateKey(dateKey)
                    .featureKey(feat.getFeatureKey())
                    .sourceEventId(ev.getId())
                    .eventType(evtType)
                    .durationMs(25L)
                    .etlJobId(job.getJobId())
                    .createdAt(LocalDateTime.now())
                    .build());

                loadedCount++;
            }

            job.setRecordsTransformed(loadedCount);
            job.setRecordsLoaded(loadedCount);
            job.setStatus("SUCCESS");
            job.setCompletedAt(LocalDateTime.now());

            etlExecutionHistoryRepository.save(job);
            log.info("ETL Pipeline completed successfully: Loaded {} records", loadedCount);

            // 4. Run Data Quality Assertions
            dataQualityEngineService.runQualityChecks(job.getJobId());

            return job;

        } catch (Exception e) {
            log.error("ETL Pipeline execution failed: {}", e.getMessage(), e);
            job.setStatus("FAILED");
            job.setErrorMessage(e.getMessage());
            job.setCompletedAt(LocalDateTime.now());
            return etlExecutionHistoryRepository.save(job);
        }
    }
}
