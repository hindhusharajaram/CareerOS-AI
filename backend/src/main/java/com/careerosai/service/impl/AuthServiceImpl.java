package com.careerosai.service.impl;

import com.careerosai.dto.AuthResponse;
import com.careerosai.dto.CompanyRegisterRequest;
import com.careerosai.dto.LoginRequest;
import com.careerosai.dto.RegisterRequest;
import com.careerosai.dto.StudentRegisterRequest;
import com.careerosai.dto.UserSummaryDto;
import com.careerosai.entity.CompanyProfile;
import com.careerosai.entity.Role;
import com.careerosai.entity.StudentProfile;
import com.careerosai.entity.User;
import com.careerosai.enums.RoleType;
import com.careerosai.exception.CompanyAlreadyExistsException;
import com.careerosai.exception.EmailAlreadyExistsException;
import com.careerosai.exception.InvalidCredentialsException;
import com.careerosai.exception.ResourceNotFoundException;
import com.careerosai.mapper.CompanyProfileMapper;
import com.careerosai.mapper.StudentProfileMapper;
import com.careerosai.mapper.UserMapper;
import com.careerosai.repository.CompanyProfileRepository;
import com.careerosai.repository.RoleRepository;
import com.careerosai.repository.StudentProfileRepository;
import com.careerosai.repository.UserRepository;
import com.careerosai.security.JwtTokenProvider;
import com.careerosai.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation handling user registration, authentication, and JWT lifecycle management.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;
    private final StudentProfileMapper studentProfileMapper;
    private final CompanyProfileMapper companyProfileMapper;

    @Override
    @Transactional
    public AuthResponse register(final RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        final RoleType roleType;
        try {
            roleType = RoleType.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        final Role userRole = getOrCreateRole(roleType);

        final User user = User.builder()
            .fullName(request.getFullName())
            .role(request.getRole().toUpperCase())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .roles(Set.of(userRole))
            .build();

        final User savedUser = Objects.requireNonNull(userRepository.save(Objects.requireNonNull(user)));

        log.info("Successfully registered new user account with User ID: {}", savedUser.getId());

        final List<String> roles = List.of(roleType.name());
        final String token = jwtTokenProvider.generateAccessTokenFromEmail(savedUser.getEmail(), roles);
        final UserSummaryDto userSummary = userMapper.toUserSummaryDto(savedUser, request.getRole().toUpperCase(), null);

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .expiresInMs(jwtTokenProvider.getExpirationInMs())
            .user(userSummary)
            .build();
    }

    @Override
    @Transactional
    public AuthResponse registerStudent(final StudentRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        final Role studentRole = getOrCreateRole(RoleType.ROLE_STUDENT);
        final User user = User.builder()
            .fullName(request.getFirstName() + " " + request.getLastName())
            .role("STUDENT")
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .roles(Set.of(studentRole))
            .build();

        final User savedUser = Objects.requireNonNull(userRepository.save(Objects.requireNonNull(user)));
        final StudentProfile studentProfile = studentProfileMapper.toEntity(request, savedUser);
        final StudentProfile savedProfile = Objects.requireNonNull(studentProfileRepository.save(Objects.requireNonNull(studentProfile)));

        log.info("Successfully registered new Student account with User ID: {}", savedUser.getId());

        final List<String> roles = List.of(RoleType.ROLE_STUDENT.name());
        final String token = jwtTokenProvider.generateAccessTokenFromEmail(savedUser.getEmail(), roles);
        final UserSummaryDto userSummary = userMapper.toUserSummaryDto(savedUser, "STUDENT", savedProfile);

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .expiresInMs(jwtTokenProvider.getExpirationInMs())
            .user(userSummary)
            .build();
    }

    @Override
    @Transactional
    public AuthResponse registerCompany(final CompanyRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        if (companyProfileRepository.existsByCompanyName(request.getCompanyName())) {
            throw new CompanyAlreadyExistsException(request.getCompanyName());
        }

        final Role companyRole = getOrCreateRole(RoleType.ROLE_COMPANY);
        final User user = User.builder()
            .fullName(request.getCompanyName())
            .role("COMPANY")
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .roles(Set.of(companyRole))
            .build();

        final User savedUser = Objects.requireNonNull(userRepository.save(Objects.requireNonNull(user)));
        final CompanyProfile companyProfile = companyProfileMapper.toEntity(request, savedUser);
        final CompanyProfile savedProfile = Objects.requireNonNull(companyProfileRepository.save(Objects.requireNonNull(companyProfile)));

        log.info("Successfully registered new Company account with User ID: {}", savedUser.getId());

        final List<String> roles = List.of(RoleType.ROLE_COMPANY.name());
        final String token = jwtTokenProvider.generateAccessTokenFromEmail(savedUser.getEmail(), roles);
        final UserSummaryDto userSummary = userMapper.toUserSummaryDto(savedUser, "COMPANY", savedProfile);

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .expiresInMs(jwtTokenProvider.getExpirationInMs())
            .user(userSummary)
            .build();
    }

    @Override
    @Transactional
    public AuthResponse login(final LoginRequest request) {
        final User user = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            userRepository.save(user);
            log.warn("Failed login attempt for user ID: {}", user.getId());
            throw new InvalidCredentialsException();
        }

        user.setLastLoginAt(LocalDateTime.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        log.info("Successful authentication for user ID: {}", user.getId());

        final List<String> roles = user.getRoles().stream()
            .map(role -> role.getName().name())
            .collect(Collectors.toList());

        final String token = jwtTokenProvider.generateAccessTokenFromEmail(user.getEmail(), roles);

        final String profileType = determineProfileType(user);
        final Object profileDetails = fetchProfileDetails(user, profileType);
        final UserSummaryDto userSummary = userMapper.toUserSummaryDto(user, profileType, profileDetails);

        return AuthResponse.builder()
            .accessToken(token)
            .tokenType("Bearer")
            .expiresInMs(jwtTokenProvider.getExpirationInMs())
            .user(userSummary)
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserSummaryDto getCurrentUser(final UUID userId) {
        final UUID targetUserId = Objects.requireNonNull(userId);
        final User user = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", targetUserId));

        final String profileType = determineProfileType(user);
        final Object profileDetails = fetchProfileDetails(user, profileType);

        return userMapper.toUserSummaryDto(user, profileType, profileDetails);
    }

    private Role getOrCreateRole(final RoleType roleType) {
        return roleRepository.findByName(roleType)
            .orElseGet(() -> Objects.requireNonNull(roleRepository.save(Objects.requireNonNull(Role.builder().name(roleType).build()))));
    }

    private String determineProfileType(final User user) {
        if (studentProfileRepository.existsByUserId(user.getId())) {
            return "STUDENT";
        }
        if (companyProfileRepository.existsByUserId(user.getId())) {
            return "COMPANY";
        }
        return "ADMIN";
    }

    private Object fetchProfileDetails(final User user, final String profileType) {
        if ("STUDENT".equals(profileType)) {
            return studentProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        if ("COMPANY".equals(profileType)) {
            return companyProfileRepository.findByUserId(user.getId()).orElse(null);
        }
        return null;
    }
}
