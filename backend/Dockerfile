# =============================================================================
# CareerOS AI Backend Service — Production Multi-Stage Dockerfile
# Stage 1: JDK Builder
# Stage 2: Minimal JRE Runtime (Non-Root Execution)
# =============================================================================

# --- Stage 1: Build Application JAR ---
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy POM and download dependencies for efficient caching
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy application source code and compile production artifact
COPY src ./src
RUN mvn package -DskipTests -B

# --- Stage 2: Production JRE Execution Environment ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system group and user
RUN addgroup -S spring && adduser -S spring -G spring

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Copy executable JAR from builder stage
COPY --from=builder /app/target/careeros-ai-backend-1.0.0.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose default HTTP port
EXPOSE 8080

# Environment Defaults
ENV PORT=8080 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Healthcheck probe using wget
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/v1/observability/health || exit 1

# Entrypoint to execute Spring Boot Application
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
