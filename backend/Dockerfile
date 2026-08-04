# =============================================================================
# CareerOS AI Backend Service — Production Multi-Stage Dockerfile
# Stage 1: JDK Builder
# Stage 2: Minimal JRE Runtime (Non-Root Execution)
# =============================================================================

# --- Stage 1: Build Environment ---
FROM alpine:3.19 AS builder
WORKDIR /app

# Install JDK 21 and Maven
RUN apk add --no-cache openjdk21 maven

# Copy POM and Maven settings for caching layer
COPY pom.xml ./
COPY settings.xml ./

# Pre-fetch dependencies with fallback resilience
RUN mvn dependency:go-offline -s settings.xml -B || true

# Copy application source code
COPY src ./src

# Build production JAR with timeout parameters
RUN mvn package -s settings.xml -DskipTests -B \
    -Dhttp.connectionTimeout=60000 \
    -Dhttp.socketTimeout=60000

# --- Stage 2: Runtime Environment ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system group and user
RUN addgroup -S spring && adduser -S spring -G spring

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R spring:spring /app

# Copy executable JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

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
