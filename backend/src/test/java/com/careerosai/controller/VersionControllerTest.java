package com.careerosai.controller;

import com.careerosai.dto.VersionInfoDto;
import com.careerosai.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VersionControllerTest {

    @Mock
    private HttpServletRequest request;

    private VersionController versionController;

    @BeforeEach
    void setUp() {
        versionController = new VersionController();
    }

    @Test
    @DisplayName("Should return accurate platform version metadata")
    void testGetVersionInfo() {
        when(request.getRequestURI()).thenReturn("/api/v1/version");

        ResponseEntity<ApiResponse<VersionInfoDto>> response = versionController.getVersionInfo(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        VersionInfoDto info = response.getBody().getData();
        assertEquals("1.0.0", info.getVersion());
        assertNotNull(info.getReleaseName());
        assertNotNull(info.getCommitHash());
        assertNotNull(info.getEnabledModules());
        assertFalse(info.getEnabledModules().isEmpty());
    }
}
