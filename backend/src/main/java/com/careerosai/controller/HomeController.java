package com.careerosai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Root Controller providing basic service health & status response.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "CareerOS AI Backend Running";
    }
}
