package com.careerosai.observability;

import com.careerosai.entity.SystemAlert;
import com.careerosai.observability.alerts.SystemAlertService;
import com.careerosai.repository.SystemAlertRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SystemAlertServiceTest {

    @Mock
    private SystemAlertRepository systemAlertRepository;

    private SystemAlertService systemAlertService;

    @BeforeEach
    void setUp() {
        systemAlertService = new SystemAlertService(systemAlertRepository);
    }

    @Test
    @DisplayName("Should create alert and save to repository")
    void testCreateAlert() {
        when(systemAlertRepository.save(any(SystemAlert.class))).thenAnswer(i -> i.getArgument(0));

        SystemAlert alert = systemAlertService.createAlert("WARNING", "ETL", "Job timed out");

        assertNotNull(alert);
        assertEquals("WARNING", alert.getAlertLevel());
        assertEquals("ETL", alert.getSourceModule());
        assertEquals("Job timed out", alert.getMessage());
        assertFalse(alert.isResolved());
    }

    @Test
    @DisplayName("Should mark alert as resolved")
    void testResolveAlert() {
        UUID alertId = UUID.randomUUID();
        SystemAlert alert = SystemAlert.builder()
            .id(alertId)
            .alertLevel("CRITICAL")
            .sourceModule("DB")
            .message("Conn error")
            .isResolved(false)
            .build();

        when(systemAlertRepository.findById(alertId)).thenReturn(Optional.of(alert));
        when(systemAlertRepository.save(any(SystemAlert.class))).thenAnswer(i -> i.getArgument(0));

        SystemAlert resolved = systemAlertService.resolveAlert(alertId);

        assertNotNull(resolved);
        assertTrue(resolved.isResolved());
    }
}
