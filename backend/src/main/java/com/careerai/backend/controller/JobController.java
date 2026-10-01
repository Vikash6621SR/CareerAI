package com.careerai.backend.controller;

import com.careerai.backend.dto.JobDtos.CreateJobRequest;
import com.careerai.backend.dto.JobDtos.JobResponse;

import com.careerai.backend.entity.Job;
import com.careerai.backend.entity.JobMatch;

import com.careerai.backend.exception.ResourceNotFoundException;

import com.careerai.backend.repository.JobMatchRepository;
import com.careerai.backend.repository.JobRepository;

import com.careerai.backend.security.CurrentUser;

import com.careerai.backend.service.AIService;
import com.careerai.backend.service.ResumeService;

import tools.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobRepository jobRepository;

    private final JobMatchRepository jobMatchRepository;

    private final CurrentUser currentUser;

    private final ResumeService resumeService;

    private final AIService aiService;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    // =====================================================
    // CREATE JOB
    // =====================================================

    @PostMapping
    public JobResponse createJob(

            @Valid
            @RequestBody
            CreateJobRequest request

    ) {

        Job job =
                Job.builder()

                        .title(
                                request.title()
                                        .trim()
                        )

                        .company(
                                request.company()
                                        .trim()
                        )

                        .location(
                                request.location()
                        )

                        .sourceUrl(
                                request.sourceUrl()
                        )

                        .description(
                                request.description()
                        )

                        .build();

        job =
                jobRepository.save(job);

        return toResponse(job);
    }

    // =====================================================
    // GET ALL JOBS
    // =====================================================

    @GetMapping
    public List<JobResponse> getJobs() {

        return jobRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =====================================================
    // GET JOB
    // =====================================================

    @GetMapping("/{id}")
    public JobResponse getJob(

            @PathVariable Long id

    ) {

        Job job =
                jobRepository
                        .findById(id)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Job not found"
                                        )
                        );

        return toResponse(job);
    }

    // =====================================================
    // MATCH RESUME WITH JOB
    // =====================================================

    @PostMapping("/{jobId}/match")
    public Map<String, Object> matchResume(

            Authentication authentication,

            @PathVariable Long jobId,

            @RequestParam Long resumeId

    ) {

        var user =
                currentUser.get(
                        authentication
                );

        Job job =
                jobRepository
                        .findById(jobId)
                        .orElseThrow(
                                () ->
                                        new ResourceNotFoundException(
                                                "Job not found"
                                        )
                        );

        var resume =
                resumeService.owned(
                        user,
                        resumeId
                );

        if (resume.getParsedText() == null
                || resume.getParsedText().isBlank()) {

            throw new ResourceNotFoundException(
                    "Resume text is not available"
            );
        }

        if (job.getDescription() == null
                || job.getDescription().isBlank()) {

            throw new ResourceNotFoundException(
                    "Job description is not available"
            );
        }

        Map<String, Object> result =
                aiService.matchResume(
                        resume.getParsedText(),
                        job.getDescription()
                );

        int matchScore =
                ((Number)
                        result.getOrDefault(
                                "matchScore",
                                0
                        ))
                        .intValue();

        String matchedSkillsJson =
                toJson(
                        result.get(
                                "matchedSkills"
                        )
                );

        String missingSkillsJson =
                toJson(
                        result.get(
                                "missingSkills"
                        )
                );

        String analysisJson =
                toJson(
                        result.get(
                                "analysis"
                        )
                );

        // -------------------------------------------------
        // Find existing match
        // -------------------------------------------------

        JobMatch match =
                jobMatchRepository
                        .findByResumeIdAndJobId(
                                resume.getId(),
                                job.getId()
                        )
                        .orElseGet(
                                () ->
                                        JobMatch.builder()
                                                .user(user)
                                                .resume(resume)
                                                .job(job)
                                                .build()
                        );

        // -------------------------------------------------
        // Update match
        // -------------------------------------------------

        match.setMatchScore(
                matchScore
        );

        match.setMatchedSkillsJson(
                matchedSkillsJson
        );

        match.setMissingSkillsJson(
                missingSkillsJson
        );

        match.setAnalysisJson(
                analysisJson
        );

        jobMatchRepository.save(match);

        return result;
    }

    // =====================================================
    // MY MATCHES
    // =====================================================

    @GetMapping("/matches/me")
    public List<JobMatch> getMyMatches(

            Authentication authentication

    ) {

        return jobMatchRepository
                .findByUserIdOrderByMatchedAtDesc(
                        currentUser
                                .get(authentication)
                                .getId()
                );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    private JobResponse toResponse(
            Job job
    ) {

        return new JobResponse(

                job.getId(),

                job.getTitle(),

                job.getCompany(),

                job.getLocation(),

                job.getSourceUrl(),

                job.getDescription()
        );
    }

    // =====================================================
    // JSON CONVERTER
    // =====================================================

    private String toJson(
            Object object
    ) {

        if (object == null) {
            return "[]";
        }

        try {

            return objectMapper.writeValueAsString(
                    object
            );

        } catch (Exception exception) {

            return "[]";
        }
    }
}