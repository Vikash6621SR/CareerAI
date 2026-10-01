package com.careerai.backend.controller;

import com.careerai.backend.entity.CareerRoadmap;
import com.careerai.backend.exception.BadRequestException;
import com.careerai.backend.exception.ResourceNotFoundException;
import com.careerai.backend.repository.CareerRoadmapRepository;
import com.careerai.backend.repository.ResumeRepository;
import com.careerai.backend.security.CurrentUser;
import com.careerai.backend.service.AIService;

import tools.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
public class CareerController {

    private final CurrentUser currentUser;

    private final CareerRoadmapRepository roadmapRepository;

    private final ResumeRepository resumeRepository;

    private final AIService aiService;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    @PostMapping("/roadmap")
    public Map<String, Object> generateRoadmap(

            Authentication authentication,

            @RequestParam String targetRole,

            @RequestParam(
                    defaultValue = "BEGINNER"
            )
            String level

    ) {

        var user =
                currentUser.get(authentication);

        if (targetRole == null ||
                targetRole.isBlank()) {

            throw new BadRequestException(
                    "Target role is required"
            );
        }

        if (level == null ||
                level.isBlank()) {

            level = "BEGINNER";
        }

        String resumeText =

                resumeRepository
                        .findByUserIdOrderByUploadedAtDesc(
                                user.getId()
                        )
                        .stream()
                        .findFirst()
                        .map(resume ->
                                resume.getParsedText()
                        )
                        .orElse("");

        Map<String, Object> result =

                aiService.generateRoadmap(
                        targetRole.trim(),
                        level.trim().toUpperCase(),
                        resumeText
                );

        try {

            CareerRoadmap roadmap =

                    roadmapRepository
                            .findByUserId(
                                    user.getId()
                            )
                            .orElse(
                                    CareerRoadmap
                                            .builder()
                                            .user(user)
                                            .build()
                            );

            roadmap.setTargetRole(
                    targetRole.trim()
            );

            roadmap.setCurrentLevel(
                    level.trim().toUpperCase()
            );

            roadmap.setRoadmapJson(
                    objectMapper.writeValueAsString(
                            result
                    )
            );

            roadmapRepository.save(
                    roadmap
            );

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Could not save career roadmap",
                    exception
            );
        }

        return result;
    }

    @GetMapping("/roadmap")
    public Map<String, Object> getRoadmap(
            Authentication authentication
    ) {

        var user = currentUser.get(authentication);

        return roadmapRepository
                .findByUserId(user.getId())
                .map(roadmap -> {

                    try {

                        return objectMapper.readValue(
                                roadmap.getRoadmapJson(),
                                Map.class
                        );

                    } catch (Exception exception) {

                        throw new BadRequestException(
                                "Saved career roadmap is invalid"
                        );
                    }

                })
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Career roadmap not found"
                        )
                );
    }
}