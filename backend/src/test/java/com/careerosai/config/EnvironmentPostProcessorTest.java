package com.careerosai.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;

@SpringBootTest
public class EnvironmentPostProcessorTest {

    @Autowired
    private Environment env;

    @Test
    public void test() {
        System.out.println("Environment property spring.datasource.url = " + env.getProperty("spring.datasource.url"));
        System.out.println("Test running!");
    }
}
