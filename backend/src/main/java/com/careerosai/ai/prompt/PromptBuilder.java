package com.careerosai.ai.prompt;

import java.util.HashMap;
import java.util.Map;

public class PromptBuilder {

    private String template;
    private final Map<String, String> variables = new HashMap<>();

    public static PromptBuilder create(final String template) {
        final PromptBuilder builder = new PromptBuilder();
        builder.template = template;
        return builder;
    }

    public PromptBuilder variable(final String name, final String value) {
        variables.put(name, value != null ? value : "");
        return this;
    }

    public String build() {
        String result = template;
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            result = result.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return result;
    }
}
