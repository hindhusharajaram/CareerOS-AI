package com.careerosai.observability;

import com.careerosai.entity.HealthSnapshot;
import com.careerosai.observability.health.HealthCheckService;
import com.careerosai.repository.HealthSnapshotRepository;
import com.careerosai.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HealthCheckServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private HealthSnapshotRepository healthSnapshotRepository;

    private HealthCheckService healthCheckService;

    @BeforeEach
    void setUp() {
        healthCheckService = new HealthCheckService(userRepository, healthSnapshotRepository);
    }

    @Test
    @DisplayName("Should return UP status when database probe passes")
    void testGetComprehensiveHealth_Success() {
        when(userRepository.count()).thenReturn(10L);

        Map<String, Object> health = healthCheckService.getComprehensiveHealth();

        assertNotNull(health);
        assertEquals("UP", health.get("status"));
        assertTrue(health.containsKey("components"));
        assertTrue(health.containsKey("systemMetrics"));

        @SuppressWarnings("unchecked")
        Map<String, String> components = (Map<String, String>) health.get("components");
        assertTrue(components.get("database").startsWith("UP"));
    }

    @Test
    @DisplayName("Should return DEGRADED status when database probe throws exception")
    void testGetComprehensiveHealth_DbFailure() {
        when(userRepository.count()).thenThrow(new RuntimeException("DB Connection Timeout"));

        Map<String, Object> health = healthCheckService.getComprehensiveHealth();

        assertNotNull(health);
        assertEquals("DEGRADED", health.get("status"));

        @SuppressWarnings("unchecked")
        Map<String, String> components = (Map<String, String>) health.get("components");
        assertTrue(components.get("database").startsWith("DOWN"));
    }

    @Test
    @DisplayName("Should save health snapshot correctly")
    @SuppressWarnings("null")
    void testRecordSnapshot() {
        when(userRepository.count()).thenReturn(5L);
        when(healthSnapshotRepository.save(any(HealthSnapshot.class))).thenAnswer(i -> i.getArgument(0));

        HealthSnapshot snapshot = healthCheckService.recordSnapshot();

        assertNotNull(snapshot);
        assertEquals("UP", snapshot.getStatus());
        assertNotNull(snapshot.getHealthJson());

        ArgumentCaptor<HealthSnapshot> captor = ArgumentCaptor.forClass(HealthSnapshot.class);
        verify(healthSnapshotRepository).save(captor.capture());
        assertEquals("UP", captor.getValue().getStatus());
    }
}
