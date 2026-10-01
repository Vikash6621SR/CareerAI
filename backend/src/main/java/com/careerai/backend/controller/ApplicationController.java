package com.careerai.backend.controller;

import com.careerai.backend.dto.ApplicationDtos.*;
import com.careerai.backend.entity.Application;
import com.careerai.backend.exception.ResourceNotFoundException;
import com.careerai.backend.repository.ApplicationRepository;
import com.careerai.backend.repository.JobRepository;
import com.careerai.backend.security.CurrentUser;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    private final JobRepository jobRepository;

    private final CurrentUser currentUser;

    // =====================================================
    // CREATE APPLICATION
    // =====================================================

    @PostMapping
    public Map<String, Object> create(

            Authentication authentication,

            @Valid
            @RequestBody
            CreateRequest request

    ) {

        var user =
                currentUser.get(
                        authentication
                );

        var job =
                jobRepository
                        .findById(
                                request.jobId()
                        )
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Job not found"
                                        )
                        );

        Application application =
                Application.builder()

                        .user(user)

                        .job(job)

                        .status(
                                request.status()
                        )

                        .appliedDate(
                                request.appliedDate()
                        )

                        .interviewDate(
                                request.interviewDate()
                        )

                        .notes(
                                request.notes()
                        )

                        .build();

        application =
                applicationRepository.save(
                        application
                );

        return toResponse(
                application
        );
    }

    // =====================================================
    // GET MY APPLICATIONS
    // =====================================================

    @GetMapping
    public List<Map<String, Object>> getApplications(
            Authentication authentication
    ) {

        return applicationRepository
                .findByUserIdOrderByUpdatedAtDesc(
                        currentUser
                                .get(authentication)
                                .getId()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =====================================================
    // UPDATE APPLICATION
    // =====================================================

    @PutMapping("/{id}")
    public Map<String, Object> update(

            Authentication authentication,

            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateRequest request

    ) {

        Long userId =
                currentUser
                        .get(authentication)
                        .getId();

        Application application =
                applicationRepository

                        .findByIdAndUserId(
                                id,
                                userId
                        )

                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Application not found"
                                        )
                        );

        application.setStatus(
                request.status()
        );

        application.setAppliedDate(
                request.appliedDate()
        );

        application.setInterviewDate(
                request.interviewDate()
        );

        application.setNotes(
                request.notes()
        );

        return toResponse(
                applicationRepository.save(
                        application
                )
        );
    }

    // =====================================================
    // DELETE APPLICATION
    // =====================================================

    @DeleteMapping("/{id}")
    public Map<String, String> delete(

            Authentication authentication,

            @PathVariable Long id

    ) {

        Long userId =
                currentUser
                        .get(authentication)
                        .getId();

        Application application =
                applicationRepository

                        .findByIdAndUserId(
                                id,
                                userId
                        )

                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Application not found"
                                        )
                        );

        applicationRepository.delete(
                application
        );

        return Map.of(
                "message",
                "Application deleted successfully"
        );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    private Map<String, Object> toResponse(
            Application application
    ) {

        return Map.of(

                "id",
                application.getId(),

                "jobId",
                application.getJob().getId(),

                "jobTitle",
                application.getJob().getTitle(),

                "company",
                application.getJob().getCompany(),

                "status",
                application.getStatus(),

                "appliedDate",
                application.getAppliedDate() == null
                        ? ""
                        : application.getAppliedDate(),

                "interviewDate",
                application.getInterviewDate() == null
                        ? ""
                        : application.getInterviewDate(),

                "notes",
                application.getNotes() == null
                        ? ""
                        : application.getNotes(),

                "createdAt",
                application.getCreatedAt(),

                "updatedAt",
                application.getUpdatedAt()
        );
    }
}