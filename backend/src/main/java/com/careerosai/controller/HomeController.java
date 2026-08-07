package com.careerosai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Root Controller providing basic service status & health ping endpoints for uptime monitors.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "CareerOS AI Backend Running";
    }

    @GetMapping({"/api/health", "/health"})
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "CareerOS AI Backend"));
    }
}
