# Spring Security & JWT Architecture Deep-Dive — CareerOS AI

## 1. Spring Security Core Architectural Components

CareerOS AI implements a stateless, token-based security architecture built on Spring Security 6+ and Spring Boot 3.4.x.

```mermaid
graph TD
    Client[HTTP Client Request] --> FilterChain[Spring Security Filter Chain]
    
    subgraph SecurityFilterChain["Security Filter Chain"]
        CORS[CorsFilter] --> JWTFilter[JwtAuthenticationFilter]
        JWTFilter --> ExceptionFilter[ExceptionTranslationFilter]
        ExceptionFilter --> AuthFilter[AuthorizationFilter]
    end

    JWTFilter -->|1. Extract Bearer Token| TokenProvider[JwtTokenProvider]
    JWTFilter -->|2. Load User Details| UserDetailsService[CustomUserDetailsService]
    UserDetailsService -->|3. Fetch Entity| DB[(PostgreSQL DB)]
    JWTFilter -->|4. Store Authentication| SecurityContext[SecurityContextHolder / SecurityContext]
    AuthFilter -->|5. Verify Roles| Controller[Protected REST Controller]
```

### Component Breakdown & Responsibilities

1. **`SecurityContextHolder`**:
   - The central repository storing details of the currently authenticated principal in the application context via `ThreadLocal` storage.
2. **`SecurityContext`**:
   - Holds the `Authentication` object associated with the current request thread.
3. **`Authentication`**:
   - Represents the authenticated user identity, principal (`UserDetails`), credentials (erased after authentication), and granted authorities (`GrantedAuthority` list: `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN`).
4. **`AuthenticationManager`**:
   - The primary API interface resolving authentication requests. Defaults to `ProviderManager`.
5. **`AuthenticationProvider` (`DaoAuthenticationProvider`)**:
   - Performs password validation by calling `UserDetailsService` to fetch user details and `PasswordEncoder` to compare BCrypt hashes.
6. **`UserDetailsService` (`CustomUserDetailsService`)**:
   - Custom domain bridge loading database `User` entities by email and converting them to Spring Security `UserDetails` objects.
7. **`PasswordEncoder` (`BCryptPasswordEncoder`)**:
   - Hashes passwords using BCrypt with strength 10.
8. **`JwtTokenProvider`**:
   - Generates, parses, signs, and validates HMAC-SHA256 JJWT tokens.
9. **`JwtAuthenticationFilter`**:
   - `OncePerRequestFilter` intercepting incoming HTTP requests, extracting the `Authorization: Bearer <token>` header, validating token validity, and populating `SecurityContextHolder`.

---

## 2. Sequence Diagrams

### 2.1 Login Authentication Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client Browser / Postman
    participant Controller as AuthController
    participant AuthMgr as AuthenticationManager (ProviderManager)
    participant DaoProvider as DaoAuthenticationProvider
    participant UserDetailsSvc as CustomUserDetailsService
    participant Encoder as PasswordEncoder (BCrypt)
    participant JwtProv as JwtTokenProvider
    participant DB as PostgreSQL Database

    Client->>Controller: POST /api/v1/auth/login (LoginRequest: email, password)
    Controller->>AuthMgr: authenticate(UsernamePasswordAuthenticationToken(email, password))
    AuthMgr->>DaoProvider: authenticate(authentication)
    DaoProvider->>UserDetailsSvc: loadUserByUsername(email)
    UserDetailsSvc->>DB: findByEmailAndDeletedAtIsNull(email)
    DB-->>UserDetailsSvc: User Entity + Roles
    UserDetailsSvc-->>DaoProvider: UserDetails (UserPrincipal)
    DaoProvider->>Encoder: matches(rawPassword, encodedPassword)
    Encoder-->>DaoProvider: true (Match)
    DaoProvider-->>AuthMgr: Fully Authenticated Authentication Object
    AuthMgr-->>Controller: Authentication Object
    Controller->>JwtProv: generateAccessToken(Authentication)
    JwtProv-->>Controller: JWT Token String (15m expiration)
    Controller-->>Client: 200 OK (ApiResponse<AuthResponse>)
```

### 2.2 JWT Request Validation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant JwtFilter as JwtAuthenticationFilter
    participant JwtProv as JwtTokenProvider
    participant UserDetailsSvc as CustomUserDetailsService
    participant SecContext as SecurityContextHolder
    participant NextFilter as FilterChain / Controller

    Client->>JwtFilter: HTTP Request (Header: Authorization: Bearer <JWT>)
    JwtFilter->>JwtFilter: Extract token string from "Bearer " header
    alt Token Present & Valid
        JwtFilter->>JwtProv: validateToken(JWT)
        JwtProv-->>JwtFilter: true (Signature & Expiration Valid)
        JwtFilter->>JwtProv: getEmailFromToken(JWT)
        JwtProv-->>JwtFilter: user@careeros.ai
        JwtFilter->>UserDetailsSvc: loadUserByUsername(email)
        UserDetailsSvc-->>JwtFilter: UserDetails Object
        JwtFilter->>SecContext: setAuthentication(UsernamePasswordAuthenticationToken(UserDetails, null, authorities))
    else Token Missing or Invalid
        JwtFilter->>JwtFilter: Do nothing (Leave SecurityContext empty)
    end
    JwtFilter->>NextFilter: doFilter(request, response)
```

### 2.3 Protected Endpoint Access Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant AuthFilter as AuthorizationFilter
    participant SecContext as SecurityContextHolder
    participant Controller as InternshipController (Protected Endpoint)

    Client->>AuthFilter: GET /api/v1/internships (Header: Bearer <JWT>)
    AuthFilter->>SecContext: getContext().getAuthentication()
    SecContext-->>AuthFilter: Authentication Object (UserPrincipal, Authorities: ROLE_STUDENT)
    AuthFilter->>AuthFilter: Check authorization rule: hasAnyRole('STUDENT', 'COMPANY', 'ADMIN')
    alt Authorized
        AuthFilter->>Controller: Forward request to Controller
        Controller-->>Client: 200 OK (ApiResponse<List<InternshipDto>>)
    else Unauthorized / Unauthenticated
        AuthFilter-->>Client: 401 Unauthorized or 403 Forbidden (ApiResponse)
    end
```

---

## 3. Sprint 1.3 Micro-Sprint Implementation Strategy

Following this architectural review (Sprint 1.3A):
- **Sprint 1.3B**: Implement `JwtTokenProvider` (standalone JJWT 0.12.6 token generation & validation engine).
- **Sprint 1.3C**: Implement `CustomUserDetailsService` & `JwtAuthenticationFilter`.
- **Sprint 1.3D**: Implement `SecurityConfig` (PasswordEncoder bean, AuthManager bean, FilterChain setup, CORS).
