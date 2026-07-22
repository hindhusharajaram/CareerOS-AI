package com.careerosai.warehouse.dimension;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "dim_date")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "dateKey")
public class DimDate {

    @Id
    @Column(name = "date_key")
    private Integer dateKey; // YYYYMMDD

    @Column(name = "full_date", nullable = false, unique = true)
    private LocalDate fullDate;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "day_of_month", nullable = false)
    private int dayOfMonth;

    @Column(name = "month_number", nullable = false)
    private int monthNumber;

    @Column(name = "month_name", nullable = false)
    private String monthName;

    @Column(name = "quarter", nullable = false)
    private int quarter;

    @Column(name = "year_number", nullable = false)
    private int yearNumber;

    @Column(name = "is_weekend", nullable = false)
    private boolean isWeekend;
}
