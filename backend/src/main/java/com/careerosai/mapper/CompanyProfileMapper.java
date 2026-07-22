package com.careerosai.mapper;

import com.careerosai.dto.CompanyRegisterRequest;
import com.careerosai.entity.CompanyProfile;
import com.careerosai.entity.User;
import org.springframework.stereotype.Component;

/**
 * Component responsible for deterministic CompanyProfile entity to DTO transformations.
 */
@Component
public class CompanyProfileMapper {

    /**
     * Maps CompanyRegisterRequest DTO to CompanyProfile domain entity.
     */
    public CompanyProfile toEntity(final CompanyRegisterRequest request, final User user) {
        if (request == null) {
            return null;
        }

        return CompanyProfile.builder()
            .user(user)
            .companyName(request.getCompanyName())
            .website(request.getWebsite())
            .location(request.getLocation())
            .industry(request.getIndustry())
            .description(request.getDescription())
            .build();
    }
}
