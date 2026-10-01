package com.careerai.backend.controller;

import com.careerai.backend.entity.Resume;

import com.careerai.backend.security.CurrentUser;

import com.careerai.backend.service.AnalysisService;
import com.careerai.backend.service.ResumeService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final CurrentUser currentUser;

    private final ResumeService resumeService;

    private final AnalysisService analysisService;


    // =====================================================
    // UPLOAD
    // =====================================================

    @PostMapping("/upload")
    public Map<String, Object> upload(

            Authentication authentication,

            @RequestParam("file")
            MultipartFile file

    ) {

        Resume resume =

                resumeService.upload(

                        currentUser.get(
                                authentication
                        ),

                        file
                );


        return toResponse(resume);
    }


    // =====================================================
    // GET ALL RESUMES
    // =====================================================

    @GetMapping
    public List<Map<String, Object>> list(

            Authentication authentication

    ) {

        return resumeService

                .list(
                        currentUser.get(
                                authentication
                        )
                )

                .stream()

                .map(this::toResponse)

                .toList();
    }


    // =====================================================
    // ANALYZE
    // =====================================================

    @PostMapping("/{id}/analyze")
    public Map<String, Object> analyze(

            Authentication authentication,

            @PathVariable Long id

    ) {

        return analysisService.analyze(

                currentUser.get(
                        authentication
                ),

                id
        );
    }


    // =====================================================
    // GET ANALYSIS
    // =====================================================

    @GetMapping("/{id}/analysis")
    public Map<String, Object> getAnalysis(

            Authentication authentication,

            @PathVariable Long id

    ) {

        return analysisService.get(

                currentUser.get(
                        authentication
                ),

                id
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public Map<String, String> delete(

            Authentication authentication,

            @PathVariable Long id

    ) {

        resumeService.delete(

                currentUser.get(
                        authentication
                ),

                id
        );


        return Map.of(

                "message",

                "Resume deleted successfully"
        );
    }


    // =====================================================
    // RESPONSE
    // =====================================================

    private Map<String, Object> toResponse(
            Resume resume
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();


        response.put(
                "id",
                resume.getId()
        );


        response.put(
                "fileName",
                resume.getFileName()
        );


        response.put(
                "fileType",
                resume.getFileType()
        );


        response.put(
                "fileSize",
                resume.getFileSize()
        );


        response.put(
                "uploadedAt",
                resume.getUploadedAt()
        );


        return response;
    }
}