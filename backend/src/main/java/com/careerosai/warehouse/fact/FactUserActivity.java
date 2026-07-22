package com.careerosai.warehouse.fact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fact_user_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "factId")
public class FactUserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "fact_id")
    private UUID factId;

    @Column(name = "user_key")
    private UUID userKey;

    @Column(name = "date_key")
    private Integer dateKey;

    @Column(name = "feature_key")
    private UUID featureKey;

    @Column(name = "source_event_id")
    private UUID sourceEventId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "duration_ms")
    private Long durationMs;

    @Column(name = "etl_job_id")
    private UUID etlJobId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
