-- CareerOS AI — PostgreSQL Relational Schema Baseline DDL (V1)
-- Requires PostgreSQL 13+ (UUID extension support)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. USERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    deleted_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    last_password_change_at TIMESTAMP NULL,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- =============================================================================
-- 2. ROLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Seed Baseline Roles
INSERT INTO roles (name) VALUES ('ROLE_STUDENT'), ('ROLE_COMPANY'), ('ROLE_ADMIN')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- 3. USER_ROLES JOIN TABLE (N:M Relationship)
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- =============================================================================
-- 4. STUDENT_PROFILES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_photo TEXT,
    phone VARCHAR(20),
    gender VARCHAR(20),
    date_of_birth VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    university_name VARCHAR(255) NOT NULL,
    degree VARCHAR(100),
    major VARCHAR(150) NOT NULL,
    branch VARCHAR(150),
    gpa NUMERIC(3, 2),
    graduation_year INT NOT NULL,
    current_semester INT,
    about TEXT,
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4.1 SKILLS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Baseline Popular Skills
INSERT INTO skills (skill_name, category, icon) VALUES 
('Java', 'Backend', 'code'),
('Python', 'Backend/AI', 'code'),
('React', 'Frontend', 'layout'),
('TypeScript', 'Frontend', 'code'),
('Spring Boot', 'Backend', 'server'),
('PostgreSQL', 'Database', 'database'),
('Node.js', 'Backend', 'server'),
('SQL', 'Database', 'database'),
('Machine Learning', 'AI/Data', 'brain'),
('Data Structures', 'CS Fundamentals', 'cpu'),
('Docker', 'DevOps', 'box'),
('Git', 'Tools', 'git-branch'),
('Tailwind CSS', 'Frontend', 'palette'),
('REST APIs', 'Backend', 'globe')
ON CONFLICT (skill_name) DO NOTHING;

-- =============================================================================
-- 4.2 STUDENT_SKILLS JOIN TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency VARCHAR(50) NOT NULL,
    years_of_experience NUMERIC(3, 1) DEFAULT 1.0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_skill UNIQUE (student_id, skill_id)
);

-- =============================================================================
-- 4.3 EDUCATION TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    specialization VARCHAR(150),
    start_year INT NOT NULL,
    end_year INT,
    cgpa NUMERIC(3, 2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4.4 PROJECTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies VARCHAR(255),
    github_link VARCHAR(255),
    live_link VARCHAR(255),
    start_date VARCHAR(30),
    end_date VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4.5 CERTIFICATES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    issue_date VARCHAR(30),
    credential_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4.6 EXPERIENCE TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(150) NOT NULL,
    description TEXT,
    start_date VARCHAR(30),
    end_date VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4.7 CAREER_GOALS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS career_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL UNIQUE REFERENCES student_profiles(id) ON DELETE CASCADE,
    preferred_role VARCHAR(150),
    preferred_domain VARCHAR(150),
    preferred_location VARCHAR(150),
    expected_salary NUMERIC(12, 2),
    higher_studies BOOLEAN DEFAULT FALSE,
    target_companies VARCHAR(255),
    work_mode VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 5. COMPANY_PROFILES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    website VARCHAR(255),
    location VARCHAR(255),
    industry VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_company_profiles_name ON company_profiles(company_name);

-- =============================================================================
-- 6. INTERNSHIPS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    work_mode VARCHAR(20) NOT NULL,
    stipend_monthly NUMERIC(10, 2),
    deadline TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_internships_company_id ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status);

-- =============================================================================
-- 7. APPLICATIONS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    cover_letter TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_student_internship UNIQUE (internship_id, student_id)
);

-- =============================================================================
-- 8. FILE_METADATA TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS file_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    upload_type VARCHAR(50) NOT NULL, -- RESUME, CERTIFICATE, PROFILE_PHOTO
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 9. RESUMES TABLE (Versioning)
-- =============================================================================
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES file_metadata(id) ON DELETE CASCADE,
    version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    parsed_content TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 10. SKILL TAXONOMY TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    master_skill_id UUID NOT NULL REFERENCES master_skills(id) ON DELETE CASCADE,
    alias VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Taxonomy Baseline
INSERT INTO skill_categories (category_name) VALUES ('Programming'), ('Backend'), ('Frontend'), ('Database'), ('AI/ML')
ON CONFLICT (category_name) DO NOTHING;

-- =============================================================================
-- 11. ANALYTICS_EVENTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 12. CAREER INTELLIGENCE PERSISTENCE TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS career_score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    category_scores_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    ats_score INT NOT NULL,
    feedback_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(150) NOT NULL,
    roadmap_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eligibility_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    report_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 13. AI CHAT & CONVERSATION HISTORY TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    session_title VARCHAR(255) NOT NULL DEFAULT 'Career Conversation',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 14. EVENT-DRIVEN ANALYTICS PLATFORM TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    summary_date DATE NOT NULL UNIQUE,
    dau INT NOT NULL DEFAULT 0,
    wau INT NOT NULL DEFAULT 0,
    mau INT NOT NULL DEFAULT 0,
    resume_upload_count INT NOT NULL DEFAULT 0,
    career_score_count INT NOT NULL DEFAULT 0,
    recommendation_count INT NOT NULL DEFAULT 0,
    ai_usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_feature_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name VARCHAR(100) NOT NULL UNIQUE,
    usage_count BIGINT NOT NULL DEFAULT 0,
    last_used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 15. ANALYTICS WAREHOUSE & DATA ENGINEERING TABLES (STAR SCHEMA)
-- =============================================================================

-- DIMENSION TABLES
CREATE TABLE IF NOT EXISTS dim_user (
    user_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    graduation_year INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dim_date (
    date_key INT PRIMARY KEY, -- YYYYMMDD format
    full_date DATE NOT NULL UNIQUE,
    day_of_week VARCHAR(20) NOT NULL,
    day_of_month INT NOT NULL,
    month_number INT NOT NULL,
    month_name VARCHAR(20) NOT NULL,
    quarter INT NOT NULL,
    year_number INT NOT NULL,
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS dim_skill (
    skill_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    is_technical BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS dim_project (
    project_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_title VARCHAR(255) NOT NULL,
    technologies TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dim_company (
    company_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL UNIQUE,
    industry VARCHAR(100),
    location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS dim_resume (
    resume_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL UNIQUE,
    version INT NOT NULL,
    file_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dim_feature (
    feature_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS dim_career_goal (
    goal_key UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_role VARCHAR(100) NOT NULL UNIQUE,
    industry VARCHAR(100)
);

-- FACT TABLES
CREATE TABLE IF NOT EXISTS fact_user_activity (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    feature_key UUID REFERENCES dim_feature(feature_key),
    source_event_id UUID,
    event_type VARCHAR(100) NOT NULL,
    duration_ms BIGINT DEFAULT 0,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_resume_analysis (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    resume_key UUID REFERENCES dim_resume(resume_key),
    ats_score INT NOT NULL DEFAULT 0,
    skills_count INT NOT NULL DEFAULT 0,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_ai_usage (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    feature_key UUID REFERENCES dim_feature(feature_key),
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_profile_updates (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    field_updated VARCHAR(100) NOT NULL,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_career_scores (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    career_score INT NOT NULL,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_recommendations (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    recommendation_type VARCHAR(100) NOT NULL,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fact_interviews (
    fact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_key UUID REFERENCES dim_user(user_key),
    date_key INT REFERENCES dim_date(date_key),
    target_role VARCHAR(100) NOT NULL,
    questions_count INT NOT NULL DEFAULT 0,
    source_event_id UUID,
    etl_job_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ETL AUDIT & DATA QUALITY TABLES
CREATE TABLE IF NOT EXISTS etl_execution_history (
    job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pipeline_name VARCHAR(100) NOT NULL,
    pipeline_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0',
    records_extracted INT NOT NULL DEFAULT 0,
    records_transformed INT NOT NULL DEFAULT 0,
    records_loaded INT NOT NULL DEFAULT 0,
    records_rejected INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED, RUNNING
    error_message TEXT,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS data_quality_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES etl_execution_history(job_id),
    total_assertions INT NOT NULL DEFAULT 0,
    passed_assertions INT NOT NULL DEFAULT 0,
    failed_assertions INT NOT NULL DEFAULT 0,
    quality_score INT NOT NULL DEFAULT 100, -- 0 to 100
    report_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 16. OBSERVABILITY & PRODUCTION MONITORING TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details_json TEXT,
    ip_address VARCHAR(50),
    trace_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    metric_unit VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_level VARCHAR(50) NOT NULL, -- INFO, WARNING, CRITICAL
    source_module VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50) NOT NULL, -- UP, DOWN, DEGRADED
    health_json TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
