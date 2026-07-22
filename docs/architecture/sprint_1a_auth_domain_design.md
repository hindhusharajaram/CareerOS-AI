# Sprint 1A Architecture & Domain Design Document: Authentication & Authorization (Refined)

## 1. Executive Summary & Functional Requirements

The Authentication & Access Control system forms the security perimeter for CareerOS AI. It provides identity management, dual-token stateless authentication, role-based access control (RBAC), and user profile provisioning for three primary user personas: **Student**, **Company Representative**, and **Administrator**.

### Functional Requirements
1. **User Registration**:
   - **Student Registration**: Register with email, password, first name, last name, university name, major, and graduation year.
   - **Company Registration**: Register with email, password, company name, website, location, and industry.
2. **User Login & Dual-Token Strategy**:
   - Authenticate credentials (email + password) using BCrypt password hashing.
   - Return a short-lived signed JWT Access Token (15-minute validity) and provision for long-lived Refresh Tokens (7-day validity).
3. **Role-Based Access Control (RBAC)**:
   - Enforce system roles: `ROLE_STUDENT`, `ROLE_COMPANY`, `ROLE_ADMIN` via N:M join table (`user_roles`).
   - Protect REST API endpoints based on role authorizations.
4. **Current User Profile Retrieval**:
   - Authenticated `/api/v1/auth/me` endpoint to retrieve active user identity, assigned roles, and profile snapshot.
5. **Soft Deletion & Security Auditing**:
   - Support soft deletion via nullable `deleted_at` timestamp.
   - Track security metrics: `last_login_at`, `last_password_change_at`, and `failed_login_attempts`.

---

## 2. Password Complexity & Validation Rules

All user passwords must strictly satisfy enterprise complexity requirements:
- **Length**: Minimum 8 characters, Maximum 64 characters.
- **Character Diversity Requirements**:
  - At least 1 uppercase letter (`[A-Z]`)
  - At least 1 lowercase letter (`[a-z]`)
  - At least 1 numerical digit (`[0-9]`)
  - At least 1 special character (`[!@#$%^&*(),.?":{}|<>]`)
- **Jakarta Validation Regex Pattern**:
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,64}$`

---

## 3. Refined Domain Model & Database Schema

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ USER_ROLES : holds
    ROLES ||--o{ USER_ROLES : assigned
    USERS ||--o| STUDENT_PROFILES : owns
    USERS ||--o| COMPANY_PROFILES : owns

    USERS {
        uuid id PK
        string email UK "NOT NULL"
        string password_hash "NOT NULL"
        timestamp deleted_at "Nullable soft delete"
        timestamp last_login_at "Nullable"
        timestamp last_password_change_at "Nullable"
        integer failed_login_attempts "DEFAULT 0"
        timestamp created_at "NOT NULL"
        timestamp updated_at "NOT NULL"
    }

    ROLES {
        bigint id PK
        string name UK "RoleType Enum (ROLE_STUDENT, ROLE_COMPANY, ROLE_ADMIN)"
    }

    USER_ROLES {
        uuid user_id FK
        bigint role_id FK
    }

    STUDENT_PROFILES {
        uuid id PK
        uuid user_id FK,UK "NOT NULL"
        string first_name "NOT NULL"
        string last_name "NOT NULL"
        string phone
        string university_name "NOT NULL"
        string major "NOT NULL"
        decimal gpa
        integer graduation_year "NOT NULL"
        timestamp created_at "NOT NULL"
        timestamp updated_at "NOT NULL"
    }

    COMPANY_PROFILES {
        uuid id PK
        uuid user_id FK,UK "NOT NULL"
        string company_name UK "NOT NULL"
        string website
        string location
        string industry
        text description
        timestamp created_at "NOT NULL"
        timestamp updated_at "NOT NULL"
    }
```

---

## 4. Sequence Diagrams

### 4.1 Student Registration Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Client
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant StudentRepo as StudentProfileRepository
    participant DB as PostgreSQL Database

    Student->>Controller: POST /api/v1/auth/register/student (StudentRegisterRequest)
    Controller->>Service: registerStudent(request)
    Service->>UserRepo: existsByEmail(request.email)
    UserRepo-->>Service: false
    Service->>Service: Hash password via BCrypt
    Service->>UserRepo: save(User entity with ROLE_STUDENT)
    UserRepo->>DB: INSERT INTO users, user_roles
    DB-->>UserRepo: Saved User Entity
    Service->>StudentRepo: save(StudentProfile entity)
    StudentRepo->>DB: INSERT INTO student_profiles
    DB-->>StudentRepo: Saved Profile
    Service->>Service: Generate JWT Access Token (15m validity)
    Service-->>Controller: AuthResponse
    Controller-->>Student: 201 Created (ApiResponse<AuthResponse>)
```

### 4.2 Company Registration Flow

```mermaid
sequenceDiagram
    autonumber
    actor Company as Company Client
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant UserRepo as UserRepository
    participant CompanyRepo as CompanyProfileRepository
    participant DB as PostgreSQL Database

    Company->>Controller: POST /api/v1/auth/register/company (CompanyRegisterRequest)
    Controller->>Service: registerCompany(request)
    Service->>UserRepo: existsByEmail(request.email)
    UserRepo-->>Service: false
    Service->>CompanyRepo: existsByCompanyName(request.companyName)
    CompanyRepo-->>Service: false
    Service->>Service: Hash password via BCrypt
    Service->>UserRepo: save(User entity with ROLE_COMPANY)
    UserRepo->>DB: INSERT INTO users, user_roles
    DB-->>UserRepo: Saved User Entity
    Service->>CompanyRepo: save(CompanyProfile entity)
    CompanyRepo->>DB: INSERT INTO company_profiles
    DB-->>CompanyRepo: Saved Profile
    Service->>Service: Generate JWT Access Token (15m validity)
    Service-->>Controller: AuthResponse
    Controller-->>Company: 201 Created (ApiResponse<AuthResponse>)
```

### 4.3 User Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App
    participant Controller as AuthController
    participant AuthMgr as AuthenticationManager
    participant UserDetails as CustomUserDetailsService
    participant TokenProv as JwtTokenProvider
    participant DB as PostgreSQL Database

    Client->>Controller: POST /api/v1/auth/login (LoginRequest)
    Controller->>AuthMgr: authenticate(UsernamePasswordAuthenticationToken)
    AuthMgr->>UserDetails: loadUserByUsername(email)
    UserDetails->>DB: SELECT u.*, r.* FROM users u JOIN user_roles... WHERE email = ? AND deleted_at IS NULL
    DB-->>UserDetails: User Entity + Roles
    alt Credentials Valid
        AuthMgr->>AuthMgr: Verify BCrypt password hash
        AuthMgr-->>Controller: Authentication Object
        Controller->>TokenProv: generateAccessToken(Authentication) [15m]
        Controller->>TokenProv: generateRefreshToken(Authentication) [7d]
        Controller->>DB: UPDATE users SET last_login_at = NOW(), failed_login_attempts = 0
        Controller-->>Client: 200 OK (ApiResponse<AuthResponse>)
    else Credentials Invalid
        Controller->>DB: UPDATE users SET failed_login_attempts = failed_login_attempts + 1
        Controller-->>Client: 401 Unauthorized (ApiResponse Bad Credentials)
    end
```

### 4.4 Get Current User (`/me`) Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as Authenticated Client
    participant Filter as JwtAuthenticationFilter
    participant TokenProv as JwtTokenProvider
    participant Controller as AuthController
    participant Service as AuthServiceImpl
    participant DB as PostgreSQL Database

    Client->>Filter: GET /api/v1/auth/me (Header: Bearer <JWT>)
    Filter->>TokenProv: validateToken(JWT)
    TokenProv-->>Filter: true (Claims valid)
    Filter->>Filter: Set Authentication in SecurityContextHolder
    Filter->>Controller: Forward Request
    Controller->>Service: getCurrentUserSummary(userId)
    Service->>DB: SELECT user + profile details
    DB-->>Service: Profile & Role Snapshot
    Service-->>Controller: UserSummaryDto
    Controller-->>Client: 200 OK (ApiResponse<UserSummaryDto>)
```

---

## 5. Token Lifecycle Architecture & Dual-Token Strategy

```mermaid
graph LR
    Login[User Login] -->|Returns| AccessToken[Short-Lived Access Token: 15 mins]
    Login -->|Returns| RefreshToken[Long-Lived Refresh Token: 7 days]

    AccessToken -->|Passed in Header| ProtectedAPIs[Protected REST APIs]
    RefreshToken -->|Passed to /auth/refresh| TokenRefreshEndpoint[Refresh Token Endpoint]
    TokenRefreshEndpoint -->|Issues New| AccessToken
```

- **Access Token**:
  - Lifetime: 15 minutes.
  - Storage: In-memory (React AuthContext state).
  - Purpose: Authorization header for API requests.
- **Refresh Token Architecture (Future Ready)**:
  - Lifetime: 7 days.
  - Storage: HTTP-Only Secure Cookie.
  - Token Rotation: Single-use rotation strategy (invalidates previous refresh token upon renewal).

---

## 6. Future-State Architecture Specifications

### 6.1 Email Verification Flow
- **Workflow**: Upon registration, user account is marked `email_verified = false`. An asynchronous token (`email_verification_tokens` table) with a 24-hour expiration link is generated and sent via SMTP/SendGrid.
- **Verification Endpoint**: `GET /api/v1/auth/verify-email?token=...` updates status to `email_verified = true`.

### 6.2 Account Lockout Strategy
- **Threshold**: Maximum 5 consecutive failed login attempts (`failed_login_attempts >= 5`).
- **Lock Action**: Sets `account_locked_until = NOW() + 15 minutes`.
- **Reset**: Successful authentication resets `failed_login_attempts` to 0.
