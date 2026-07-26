package com.careerosai.observability;

import com.careerosai.entity.AuditLog;
import com.careerosai.observability.audit.AuditLogService;
import com.careerosai.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    private AuditLogService auditLogService;

    @BeforeEach
    void setUp() {
        auditLogService = new AuditLogService(auditLogRepository);
    }

    @Test
    @DisplayName("Should create immutable audit log record")
    void testLogAction() {
        UUID userId = UUID.randomUUID();
        when(auditLogRepository.save(any(AuditLog.class))).thenAnswer(i -> i.getArgument(0));

        AuditLog log = auditLogService.logAction(userId, "USER_LOGIN", "AUTH_SERVICE", "{\"email\":\"test@careeros.ai\"}", "192.168.1.1");

        assertNotNull(log);
        assertEquals(userId, log.getUserId());
        assertEquals("USER_LOGIN", log.getAction());
        assertEquals("AUTH_SERVICE", log.getResource());
        assertEquals("192.168.1.1", log.getIpAddress());
    }
}
