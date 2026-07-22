package com.careerosai.entity;

import com.careerosai.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Domain Entity representing Student Career Aspirations & Targets.
 */
@Entity
@Table(name = "career_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false, of = "id")
public class CareerGoal extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Associated student profile cannot be null")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false, unique = true)
    private StudentProfile studentProfile;

    @Column(name = "preferred_role", length = 150)
    private String preferredRole;

    @Column(name = "preferred_domain", length = 150)
    private String preferredDomain;

    @Column(name = "preferred_location", length = 150)
    private String preferredLocation;

    @Column(name = "expected_salary", precision = 12, scale = 2)
    private BigDecimal expectedSalary;

    @Builder.Default
    @Column(name = "higher_studies")
    private Boolean higherStudies = false;

    @Column(name = "target_companies")
    private String targetCompanies;

    @Column(name = "work_mode", length = 50)
    private String workMode; // REMOTE, HYBRID, ONSITE
}
