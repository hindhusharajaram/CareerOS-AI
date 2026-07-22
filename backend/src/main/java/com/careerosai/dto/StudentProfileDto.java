package com.careerosai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfileDto {
    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String profilePhoto;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String city;
    private String state;
    private String country;
    private String universityName;
    private String degree;
    private String major;
    private String branch;
    private BigDecimal gpa;
    private Integer graduationYear;
    private Integer currentSemester;
    private String about;
    private String linkedin;
    private String github;
    private String portfolio;
}
