# =============================================================================
# CareerOS AI Backend Service — Production Multi-Stage Dockerfile
# Stage 1: JDK Builder
# Stage 2: Minimal JRE Runtime (Non-Root Execution)
# =============================================================================

# --- Stage 1: Build Environment ---
FROM alpine:3.19 AS builder
WORKDIR /app

RUN apk add --no-cache openjdk21 maven

COPY pom.xml ./
COPY settings.xml ./

RUN mvn dependency:go-offline -s settings.xml -B || true

COPY src ./src

RUN mvn package -s settings.xml -DskipTests -B \
    -Dhttp.connectionTimeout=60000 \
    -Dhttp.socketTimeout=60000

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root system group and user
RUN addgroup -S spring && adduser -S spring -G spring

# Create uploads directory with appropriate permissions
RUN mkdir -p /app/uploads && chown -R spring:spring /app

COPY --from=builder /app/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

EXPOSE 8080 10000

ENV PORT=10000 \
    SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -jar app.jar"]
