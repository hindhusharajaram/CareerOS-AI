package com.careerosai.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Component responsible for generating, parsing, and validating JWT access tokens using JJWT 0.12.6.
 */
@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expirationInMs;

    public JwtTokenProvider(
        @Value("${app.jwt.secret}") final String secret,
        @Value("${app.jwt.expiration-ms:900000}") final long expirationInMs // Default 15 minutes (900,000 ms)
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationInMs = expirationInMs;
    }

    public long getExpirationInMs() {
        return expirationInMs;
    }

    /**
     * Generate short-lived JWT Access Token from Spring Security Authentication.
     *
     * @param authentication Active authenticated principal
     * @return Signed JWT Access Token string
     */
    public String generateAccessToken(final Authentication authentication) {
        final String email = authentication.getName();
        final List<String> roles = authentication.getAuthorities().stream()
            .map(auth -> auth.getAuthority())
            .collect(Collectors.toList());

        final Date now = new Date();
        final Date expiryDate = new Date(now.getTime() + expirationInMs);

        return Jwts.builder()
            .subject(email)
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact();
    }

    /**
     * Generate JWT Access Token from Email and Roles list.
     *
     * @param email User email address
     * @param roles Assigned role strings
     * @return Signed JWT Access Token string
     */
    public String generateAccessTokenFromEmail(final String email, final List<String> roles) {
        final Date now = new Date();
        final Date expiryDate = new Date(now.getTime() + expirationInMs);

        return Jwts.builder()
            .subject(email)
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(secretKey)
            .compact();
    }

    /**
     * Extract Email (Subject) from JWT token.
     *
     * @param token JWT token string
     * @return Subject email
     */
    public String getEmailFromToken(final String token) {
        final Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        return claims.getSubject();
    }

    /**
     * Extract Roles list claim from JWT token.
     *
     * @param token JWT token string
     * @return List of role names
     */
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(final String token) {
        final Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        return claims.get("roles", List.class);
    }

    /**
     * Validate JWT token signature and expiration status.
     *
     * @param token JWT token string
     * @return true if valid, false if invalid or expired
     */
    public boolean validateToken(final String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token format: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty: {}", ex.getMessage());
        }
        return false;
    }
}
