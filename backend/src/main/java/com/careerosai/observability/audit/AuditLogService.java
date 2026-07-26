package com.careerosai.observability.audit;

import com.careerosai.entity.AuditLog;
import com.careerosai.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLog logAction(final UUID userId, final String action, final String resource, final String detailsJson, final String ipAddress) {
        try {
            final String traceId = MDC.get("traceId");
            final AuditLog auditLog = auditLogRepository.save(AuditLog.builder()
                .userId(userId)
                .action(action)
                .resource(resource)
                .detailsJson(detailsJson != null ? detailsJson : "{}")
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .traceId(traceId)
                .createdAt(LocalDateTime.now())
                .build());
            log.info("Audit Action Logged: [{}] on [{}] by User [{}] TraceID [{}]", action, resource, userId, traceId);
            return auditLog;
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
            return null;
        }
    }

    public AuditLog logLogin(final UUID userId, final String email, final String ipAddress) {
        return logAction(userId, "USER_LOGIN", "AUTH_SERVICE", "{\"email\":\"" + email + "\"}", ipAddress);
    }

    public AuditLog logProfileUpdate(final UUID userId, final String detailsJson, final String ipAddress) {
        return logAction(userId, "PROFILE_UPDATE", "STUDENT_PROFILE", detailsJson, ipAddress);
    }

    public AuditLog logResumeUpload(final UUID userId, final String fileName, final String ipAddress) {
        return logAction(userId, "RESUME_UPLOAD", "FILE_STORAGE", "{\"fileName\":\"" + fileName + "\"}", ipAddress);
    }

    public AuditLog logAdminAction(final UUID userId, final String actionName, final String target, final String ipAddress) {
        return logAction(userId, actionName, "ADMIN_MODULE", "{\"target\":\"" + target + "\"}", ipAddress);
    }

    public AuditLog logAiRequest(final UUID userId, final String feature, final String promptSample, final String ipAddress) {
        return logAction(userId, "AI_REQUEST", "AI_ENGINE", "{\"feature\":\"" + feature + "\"}", ipAddress);
    }

    public AuditLog logWarehouseJob(final String pipelineName, final String status, final int recordsProcessed) {
        return logAction(null, "WAREHOUSE_JOB", "STAR_SCHEMA_ETL", "{\"pipeline\":\"" + pipelineName + "\",\"status\":\"" + status + "\",\"records\":" + recordsProcessed + "}", "127.0.0.1");
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop20ByOrderByCreatedAtDesc();
    }
}
