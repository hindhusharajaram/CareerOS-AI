package com.careerosai.security;

import com.careerosai.entity.User;
import com.careerosai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * Service implementing Spring Security UserDetailsService.
 * Bridges database User persistence with Spring Security's authentication provider.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Locates the user based on email address.
     *
     * @param email User email address
     * @return UserDetails principal object
     * @throws UsernameNotFoundException if user is not found or is soft-deleted
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        Objects.requireNonNull(email, "Email parameter cannot be null");

        final User user = userRepository.findByEmailAndDeletedAtIsNull(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new CustomUserPrincipal(user);
    }
}
