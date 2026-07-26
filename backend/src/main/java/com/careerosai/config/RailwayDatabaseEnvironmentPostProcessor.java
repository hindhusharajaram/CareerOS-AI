package com.careerosai.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.PropertySource;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

/**
 * Environment Post Processor to intercept Railway's DATABASE_URL
 * and dynamically convert it to a valid Spring Boot JDBC URL.
 */
public class RailwayDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String DATABASE_URL_PROPERTY = "DATABASE_URL";
    private static final String SPRING_DATASOURCE_URL = "spring.datasource.url";
    private static final String SPRING_DATASOURCE_USERNAME = "spring.datasource.username";
    private static final String SPRING_DATASOURCE_PASSWORD = "spring.datasource.password";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty(DATABASE_URL_PROPERTY);
        
        if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(databaseUrl);
                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath(); // Includes the leading slash e.g., /dbname
                
                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                
                Map<String, Object> properties = new HashMap<>();
                properties.put(SPRING_DATASOURCE_URL, jdbcUrl);
                
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":", 2);
                    if (parts.length > 0) {
                        properties.put(SPRING_DATASOURCE_USERNAME, parts[0]);
                    }
                    if (parts.length > 1) {
                        properties.put(SPRING_DATASOURCE_PASSWORD, parts[1]);
                    }
                }
                
                // Add these properties to the very front so they override application.yml
                PropertySource<?> railwayProperties = new MapPropertySource("railwayDatabaseProperties", properties);
                environment.getPropertySources().addFirst(railwayProperties);
                
            } catch (URISyntaxException e) {
                // Ignore parsing errors and let Spring Boot's standard mechanism fail explicitly
            }
        }
    }

    @Override
    public int getOrder() {
        // Run late enough to ensure system properties are loaded, but the addFirst() guarantees override
        return Ordered.LOWEST_PRECEDENCE;
    }
}
