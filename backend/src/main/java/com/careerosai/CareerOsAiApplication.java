package com.careerosai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Entry Point for CareerOS AI Backend Application.
 * Configured with Spring Boot 3.4+ and Java 21 LTS.
 */
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
@SpringBootApplication
public class CareerOsAiApplication {

    public static void main(final String[] args) {
        SpringApplication.run(CareerOsAiApplication.class, args);
    }
}
