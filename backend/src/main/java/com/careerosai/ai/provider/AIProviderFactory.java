package com.careerosai.ai.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
public class AIProviderFactory {

    private final ApplicationContext applicationContext;

    @Value("${careeros.ai.provider:mockAIProvider}")
    private String configuredProviderBean;

    public AIProvider getProvider() {
        final String raw = configuredProviderBean;
        final String beanName = Objects.requireNonNull((raw != null && !raw.isBlank()) ? raw : "mockAIProvider");
        if (applicationContext.containsBean(beanName)) {
            return Objects.requireNonNull(applicationContext.getBean(beanName, AIProvider.class));
        }
        return Objects.requireNonNull(applicationContext.getBean("mockAIProvider", AIProvider.class));
    }
}
