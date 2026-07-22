package com.careerosai.ai.provider;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AIProviderFactory {

    private final ApplicationContext applicationContext;

    @Value("${careeros.ai.provider:mockAIProvider}")
    private String configuredProviderBean;

    public AIProvider getProvider() {
        if (applicationContext.containsBean(configuredProviderBean)) {
            return applicationContext.getBean(configuredProviderBean, AIProvider.class);
        }
        return applicationContext.getBean("mockAIProvider", AIProvider.class);
    }
}
