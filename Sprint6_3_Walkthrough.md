# Sprint 6.3: Observability & Production Monitoring Platform — Technical Documentation & Walkthrough

## Executive Summary
Sprint 6.3 transforms **CareerOS AI** into a production-grade observable platform by establishing structured logging, diagnostic health check probes, quantitative metrics collection, distributed tracing preparation, immutable audit logging, an alert engine, and a unified operational system monitor dashboard (`/system-monitor`).

No business features, UI redesigns, or AI additions were introduced. All existing functionality from Sprints 1–6.2 remains fully operational without regressions.

---

## 1. Monitoring Architecture Overview

The observability suite is organized under `com.careerosai.observability`:

```
com.careerosai.observability
├── logging         # Structured JSON logging & MDC context populators
├── metrics         # Metrics collection engine & telemetry persistence
├── tracing         # Distributed tracing filter & header propagation
├── health          # Multifold subsystem diagnostic probes & snapshotting
├── monitoring      # Unified observability aggregator & telemetry services
├── alerts          # Real-time alert engine & alert resolution lifecycle
├── audit           # Immutable action audit logging
├── dashboard       # Dashboard REST controllers & API endpoints
├── config          # Telemetry scheduling & filter registrations
└── dto             # Unified telemetry & dashboard payload DTOs
```

---

## 2. Structured JSON Logging Strategy

All HTTP requests and operational events format log messages into structured JSON via `StructuredJsonLogger` and `TracingAndLoggingFilter`.

### Key Log Fields:
- **`timestamp`**: ISO-8601 UTC timestamp
- **`level`**: INFO, WARN, ERROR
- **`traceId`**: 128-bit UUID trace identifier
- **`spanId`**: 8-character span identifier
- **`correlationId`**: End-to-end request correlation ID
- **`requestId`**: Per-request unique ID
- **`userId`**: Authenticated user ID or `anonymous`
- **`method` & `uri`**: HTTP Method and Request URI
- **`status`**: HTTP Response Status Code
- **`executionTimeMs`**: Server-side processing duration in milliseconds
- **`exceptionClass` & `stackTrace`**: Full stack trace on exceptions

### Sample Structured JSON Log Output:
```json
{
  "timestamp": "2026-07-26T16:23:14.512Z",
  "level": "INFO",
  "logger": "com.careerosai.observability.tracing.TracingAndLoggingFilter",
  "message": "HTTP Request Processed",
  "traceId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "spanId": "a1b2c3d4",
  "correlationId": "corr-8849-ab12",
  "requestId": "req-99120412",
  "userId": "d748f211-1122-3344-5566-778899aabbcc",
  "method": "GET",
  "uri": "/api/v1/observability/dashboard",
  "status": 200,
  "executionTimeMs": 14
}
```

---

## 3. Subsystem Health Checks

Exposed via `GET /api/v1/observability/health`, returning health states for 8 key domain components:

1. **Application Health**: Core Spring Boot runtime status.
2. **Database Health**: PostgreSQL connection probe via `UserRepository.count()`.
3. **Warehouse Health**: Star Schema OLAP data warehouse status.
4. **Analytics Health**: Async event consumer queue status.
5. **AI Module Health**: Local grounded AI engine status.
6. **Disk Usage**: Total, Used, and Free disk storage in GB.
7. **JVM Memory**: Max, Total, Used, and Free JVM memory in MB, with heap usage percentage.
8. **CPU Usage**: Available processors/cores and system load average.

Snapshots are stored in the `health_snapshots` table.

---

## 4. Metrics Engine

The `ObservabilityMetricsEngine` records live performance telemetry and saves snapshots to `system_metrics`:

- **API Latency**: Average and total HTTP response latency (`ms`).
- **Request Count**: Total HTTP requests processed.
- **Error Rate**: Percentage of requests returning HTTP 4xx/5xx (`%`).
- **Active Users**: Total registered platform users.
- **JVM Heap Usage**: Used vs Max heap space (`MB` and `%`).
- **Thread Count**: Total active JVM thread count.
- **Database Query Latency**: Real-time DB query probe execution time (`ms`).
- **ETL Execution Time**: Last star schema sync pipeline duration (`ms`).
- **Event Processing Latency**: Asynchronous event ingestion delay (`ms`).

Exposed via `GET /api/v1/observability/metrics`.

---

## 5. Distributed Tracing Design

`TracingAndLoggingFilter` intercepts all requests at `HIGHEST_PRECEDENCE`:

- Generates or propagates `X-Trace-Id`, `X-Span-Id`, `X-Correlation-Id`.
- Injects these headers into outgoing HTTP responses.
- Sets MDC fields (`traceId`, `spanId`, `correlationId`, `userId`, `requestId`) for seamless SLF4J / log correlation.
- **OpenTelemetry Readiness**: Formatted to support W3C Trace Context (`traceparent` header) when OpenTelemetry SDK is attached.

---

## 6. Real-Time Alert Engine Flow

The `SystemAlertService` automatically triggers system alerts and saves them in `system_alerts`:

- **High Latency Alert**: Triggered when API execution time > 2000 ms.
- **Failed ETL Alert**: Triggered on star schema pipeline exceptions.
- **Failed Scheduler Alert**: Triggered when cron/telemetry background tasks fail.
- **Failed AI Request Alert**: Triggered on AI provider communication failures.
- **Database Connectivity Alert**: Triggered if PostgreSQL health probe fails.

### Alert Resolution:
- Endpoint `POST /api/v1/observability/alerts/{id}/resolve` marks an active alert as resolved (`is_resolved = true`).

---

## 7. Immutable Action Audit Trail

`AuditLogService` persists immutable action logs into `audit_logs`:

- **User Login**: Captures user ID, email, IP address, and trace ID.
- **Profile Updates**: Captures updated student/company details.
- **Resume Upload**: Captures file name, storage path, and user ID.
- **Admin Actions**: Captures administrative operations on analytics/warehouse modules.
- **AI Requests**: Captures feature invoked and token metadata.
- **Warehouse Jobs**: Captures ETL pipeline execution and status.

Exposed via `GET /api/v1/observability/audit-logs`.

---

## 8. Single-Page Monitoring Dashboard (`/system-monitor`)

Located at route `/system-monitor` in the React frontend:

- **System Status Card**: Displays overall status (`UP` / `DEGRADED`).
- **JVM Telemetry**: Heap memory usage bar and maximum allocations.
- **Hardware Telemetry**: CPU core count, load average, system disk utilization.
- **Subsystem Probes**: Real-time health status of DB, Warehouse, Analytics, and AI Module.
- **Operational Alert Feed**: Live active alerts with one-click **"Mark Resolved"** action.
- **Audit Activity Log**: Searchable audit log entries with Trace IDs, User IDs, and ISO timestamps.

---

## 9. Future Production Integration Blueprint

### Future Prometheus Integration
- Add `micrometer-registry-prometheus` dependency to `pom.xml`.
- Expose `/actuator/prometheus` scrape endpoint.
- Export `api.latency.avg`, `jvm.memory.used`, and `system.alerts.total` as Prometheus counters and gauges.

### Future Grafana Integration
- Configure Prometheus datasource pointing to `/actuator/prometheus`.
- Import Grafana dashboard templates for Spring Boot JVM performance, DB connection pool (HikariCP), and HTTP latency percentiles (p50, p90, p99).

### Future OpenTelemetry Integration
- Add `opentelemetry-javaagent.jar` or OpenTelemetry Spring Boot starter.
- Map MDC `traceId` and `spanId` to OpenTelemetry `Tracer` context.
- Export traces to Jaeger or OTLP collector endpoint (`http://collector:4317`).

---

## 10. Verification & Test Suite Results

### Unit Tests
Executed 8 unit tests in `com.careerosai.observability`:
- `HealthCheckServiceTest`: 3 passed, 0 failed.
- `ObservabilityMetricsEngineTest`: 2 passed, 0 failed.
- `SystemAlertServiceTest`: 2 passed, 0 failed.
- `AuditLogServiceTest`: 1 passed, 0 failed.

**Result: BUILD SUCCESS (0 Failures, 0 Errors)**

### Build Status
- **Backend**: `mvn clean compile test` -> **BUILD SUCCESS**
- **Frontend**: `npm run build` -> **BUILD SUCCESS** (dist assets generated cleanly)
