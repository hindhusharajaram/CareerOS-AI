package com.careerosai.entity;

import com.careerosai.audit.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * Domain Entity representing Student Professional Certifications.
 */
@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = false, of = "id")
public class Certificate extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Associated student profile cannot be null")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private StudentProfile studentProfile;

    @NotBlank(message = "Certificate title cannot be blank")
    @Column(name = "title", nullable = false)
    private String title;

    @NotBlank(message = "Provider / Issuing organization cannot be blank")
    @Column(name = "provider", nullable = false)
    private String provider;

    @Column(name = "issue_date", length = 30)
    private String issueDate;

    @Column(name = "credential_url")
    private String credentialUrl;
}
