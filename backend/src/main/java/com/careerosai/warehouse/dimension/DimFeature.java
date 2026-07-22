package com.careerosai.warehouse.dimension;

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

import java.util.UUID;

@Entity
@Table(name = "dim_feature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "featureKey")
public class DimFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "feature_key")
    private UUID featureKey;

    @Column(name = "feature_name", nullable = false, unique = true, length = 100)
    private String featureName;

    @Column(name = "module", nullable = false, length = 100)
    private String module;
}
