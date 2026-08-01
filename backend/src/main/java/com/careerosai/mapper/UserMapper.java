package com.careerosai.mapper;

import com.careerosai.dto.UserSummaryDto;
import com.careerosai.entity.User;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Component responsible for deterministic User entity to DTO transformations.
 */
@Component
public class UserMapper {

    /**
     * Maps User entity and profile details to UserSummaryDto.
     *
     * @param user User domain entity
     * @param profileType Profile category (STUDENT, COMPANY, ADMIN)
     * @param profileDetails Associated profile DTO object
     * @return Formatted UserSummaryDto
     */
    public UserSummaryDto toUserSummaryDto(
        final User user,
        final String profileType,
        final Object profileDetails
    ) {
        if (user == null) {
            return null;
        }

        final Set<String> roleNames = (user.getRoles() != null)
            ? user.getRoles().stream()
                .filter(Objects::nonNull)
                .map(r -> r.getName())
                .filter(Objects::nonNull)
                .map(roleType -> roleType.name())
                .collect(Collectors.toSet())
            : Collections.emptySet();

        return UserSummaryDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .roles(roleNames)
            .profileType(profileType)
            .profileDetails(profileDetails)
            .build();
    }
}
