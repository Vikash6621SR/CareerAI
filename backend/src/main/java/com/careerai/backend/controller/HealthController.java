package com.careerai.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public String health() {

        return "CareerAI Backend is running successfully!";
    }
}