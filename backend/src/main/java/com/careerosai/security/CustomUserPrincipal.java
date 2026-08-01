package com.careerosai.security;

import com.careerosai.entity.User;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Adapter class implementing Spring Security UserDetails.
 * Wraps the domain User entity and maps roles to GrantedAuthority objects.
 */
@Getter
@EqualsAndHashCode(of = "id")
public class CustomUserPrincipal implements UserDetails {

    private final UUID id;
    private final String email;
    private final String passwordHash;
    private final boolean active;
    private final Collection<? extends GrantedAuthority> authorities;

    /**
     * Constructs a CustomUserPrincipal from a User domain entity.
     *
     * @param user Domain User entity
     */
    public CustomUserPrincipal(final User user) {
        Objects.requireNonNull(user, "User entity cannot be null");
        this.id = user.getId();
        this.email = user.getEmail();
        this.passwordHash = user.getPasswordHash();
        this.active = user.getDeletedAt() == null;
        this.authorities = mapRolesToAuthorities(user);
    }

    /**
     * Map User roles to a Collection of SimpleGrantedAuthority objects.
     */
    private static Collection<? extends GrantedAuthority> mapRolesToAuthorities(final User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            return Collections.emptyList();
        }
        return user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
            .collect(Collectors.toUnmodifiableSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
