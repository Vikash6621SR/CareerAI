package com.careerai.backend.service;

import com.careerai.backend.entity.Resume;
import com.careerai.backend.entity.ResumeAnalysis;

import com.careerai.backend.entity.User;

import com.careerai.backend.exception.ResourceNotFoundException;

import com.careerai.backend.repository.ResumeAnalysisRepository;

import tools.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final ResumeAnalysisRepository analysisRepository;

    private final ResumeService resumeService;

    private final AIService aiService;

    private final ObjectMapper objectMapper =
            new ObjectMapper();


    // =====================================================
    // ANALYZE RESUME
    // =====================================================

    public Map<String, Object> analyze(

            User user,

            Long resumeId

    ) {

        Resume resume =
                resumeService.owned(
                        user,
                        resumeId
                );


        Map<String, Object> data =

                aiService.analyzeResume(
                        resume.getParsedText()
                );


        ResumeAnalysis analysis =

                analysisRepository

                        .findByResumeId(resumeId)

                        .orElse(

                                ResumeAnalysis

                                        .builder()

                                        .resume(resume)

                                        .build()
                        );


        analysis.setAtsScore(

                ((Number)
                        data.getOrDefault(
                                "atsScore",
                                0
                        ))
                        .intValue()
        );


        analysis.setSummary(

                String.valueOf(

                        data.getOrDefault(
                                "summary",
                                ""
                        )
                )
        );


        analysis.setStrengthsJson(
                toJson(
                        data.get("strengths")
                )
        );


        analysis.setWeaknessesJson(
                toJson(
                        data.get("weaknesses")
                )
        );


        analysis.setMissingSkillsJson(
                toJson(
                        data.get("missingSkills")
                )
        );


        analysis.setRecommendationsJson(
                toJson(
                        data.get("recommendations")
                )
        );


        analysis.setKeywordsJson(
                toJson(
                        data.get("keywords")
                )
        );


        analysisRepository.save(
                analysis
        );


        return data;
    }


    // =====================================================
    // GET ANALYSIS
    // =====================================================

    public Map<String, Object> get(

            User user,

            Long resumeId

    ) {

        resumeService.owned(
                user,
                resumeId
        );


        ResumeAnalysis analysis =

                analysisRepository

                        .findByResumeId(
                                resumeId
                        )

                        .orElseThrow(

                                () ->
                                        new ResourceNotFoundException(
                                                "Resume analysis not found"
                                        )
                        );


        try {

            return Map.of(

                    "id",
                    analysis.getId(),

                    "resumeId",
                    resumeId,

                    "atsScore",
                    analysis.getAtsScore(),

                    "summary",
                    analysis.getSummary(),

                    "strengths",
                    objectMapper.readValue(
                            analysis.getStrengthsJson(),
                            Object.class
                    ),

                    "weaknesses",
                    objectMapper.readValue(
                            analysis.getWeaknessesJson(),
                            Object.class
                    ),

                    "missingSkills",
                    objectMapper.readValue(
                            analysis.getMissingSkillsJson(),
                            Object.class
                    ),

                    "recommendations",
                    objectMapper.readValue(
                            analysis.getRecommendationsJson(),
                            Object.class
                    ),

                    "keywords",
                    objectMapper.readValue(
                            analysis.getKeywordsJson(),
                            Object.class
                    ),

                    "analyzedAt",
                    analysis.getAnalyzedAt()
            );

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Could not read resume analysis",
                    exception
            );
        }
    }


    private String toJson(
            Object object
    ) {

        try {

            return objectMapper.writeValueAsString(

                    object == null
                            ? List.of()
                            : object
            );

        } catch (Exception exception) {

            return "[]";
        }
    }
}