package com.careerai.backend.service;

import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final RestClient client;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    private final String apiKey;

    private final String model;


    public AIService(

            @Value("${app.ai.base-url}")
            String baseUrl,

            @Value("${app.ai.api-key}")
            String apiKey,

            @Value("${app.ai.model}")
            String model

    ) {

        this.client =
                RestClient
                        .builder()
                        .baseUrl(baseUrl)
                        .build();

        this.apiKey = apiKey;

        this.model = model;
    }


    // =====================================================
    // RESUME ANALYSIS
    // =====================================================

    public Map<String, Object> analyzeResume(
            String resume
    ) {

        if (apiKey == null
                || apiKey.isBlank()) {

            return fallbackAnalysis(resume);
        }

        String prompt = """
                Analyze the following resume for an ATS-focused
                career platform.

                Return ONLY valid JSON.

                Required fields:

                atsScore
                summary
                strengths
                weaknesses
                missingSkills
                recommendations
                keywords

                Do not invent information.

                RESUME:

                """ + resume;

        return callAI(prompt);
    }


    // =====================================================
    // JOB MATCHING
    // =====================================================

    public Map<String, Object> matchResume(

            String resume,

            String jobDescription

    ) {

        if (apiKey == null
                || apiKey.isBlank()) {

            return fallbackMatch(
                    resume,
                    jobDescription
            );
        }

        String prompt = """
                Compare the resume with the job description.

                Return ONLY valid JSON.

                Required fields:

                matchScore
                matchedSkills
                missingSkills
                analysis

                RESUME:

                """ + resume +

                """

                JOB DESCRIPTION:

                """ + jobDescription;

        return callAI(prompt);
    }


    // =====================================================
    // CAREER ROADMAP
    // =====================================================

    public Map<String, Object> generateRoadmap(

            String targetRole,

            String level,

            String resume

    ) {

        if (apiKey == null
                || apiKey.isBlank()) {

            return fallbackRoadmap(
                    targetRole,
                    level
            );
        }

        String prompt = """
                Create a practical career roadmap.

                Target role:

                """ + targetRole +

                """

                Current level:

                """ + level +

                """

                Return ONLY valid JSON.

                Required fields:

                targetRole
                currentLevel
                steps

                Resume:

                """ + resume;

        return callAI(prompt);
    }


    // =====================================================
    // OPENAI REQUEST
    // =====================================================

    @SuppressWarnings({
            "rawtypes",
            "unchecked"
    })
    private Map<String, Object> callAI(
            String prompt
    ) {

        try {

            Map<String, Object> body =
                    new HashMap<>();


            body.put(
                    "model",
                    model
            );


            body.put(
                    "temperature",
                    0.2
            );


            body.put(
                    "response_format",
                    Map.of(
                            "type",
                            "json_object"
                    )
            );


            body.put(
                    "messages",
                    List.of(

                            Map.of(
                                    "role",
                                    "system",

                                    "content",
                                    "You are a professional resume and career analysis engine."
                            ),

                            Map.of(
                                    "role",
                                    "user",

                                    "content",
                                    prompt
                            )
                    )
            );


            Map response =

                    client.post()

                            .uri(
                                    "/chat/completions"
                            )

                            .header(
                                    HttpHeaders.AUTHORIZATION,
                                    "Bearer " + apiKey
                            )

                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )

                            .body(body)

                            .retrieve()

                            .body(Map.class);


            List choices =
                    (List) response.get(
                            "choices"
                    );


            Map choice =
                    (Map) choices.get(0);


            Map message =
                    (Map) choice.get(
                            "message"
                    );


            String content =
                    (String) message.get(
                            "content"
                    );


            return objectMapper.readValue(
                    content,
                    Map.class
            );

        } catch (Exception exception) {

            throw new RuntimeException(
                    "AI analysis failed",
                    exception
            );
        }
    }


    // =====================================================
    // FALLBACK RESUME ANALYSIS
    // =====================================================

    private Map<String, Object> fallbackAnalysis(
            String resume
    ) {

        String text =
                resume.toLowerCase();


        List<String> skills =
                new ArrayList<>();


        List<String> supportedSkills =
                List.of(

                        "java",

                        "spring boot",

                        "react",

                        "javascript",

                        "typescript",

                        "mysql",

                        "sql",

                        "git",

                        "docker",

                        "aws",

                        "python",

                        "html",

                        "css",

                        "rest api",

                        "mongodb",

                        "redis",

                        "junit"
                );


        for (String skill :
                supportedSkills) {

            if (text.contains(skill)) {

                skills.add(skill);
            }
        }


        int score =

                Math.min(
                        95,
                        45 + skills.size() * 3
                );


        List<String> missingSkills =

                new ArrayList<>(
                        List.of(
                                "Docker",
                                "AWS",
                                "JUnit"
                        )
                );


        missingSkills.removeIf(
                skill ->
                        text.contains(
                                skill.toLowerCase()
                        )
        );


        return Map.of(

                "atsScore",
                score,

                "summary",
                "Resume parsed successfully. Tailor keywords and add measurable achievements.",

                "strengths",
                skills,

                "weaknesses",
                List.of(

                        "Quantified achievements may be missing",

                        "Job-specific keyword alignment can be improved"
                ),

                "missingSkills",
                missingSkills,

                "recommendations",
                List.of(

                        "Use measurable results in project bullets",

                        "Tailor the skills section to each target role",

                        "Add testing and deployment technologies where applicable"
                ),

                "keywords",
                skills
        );
    }


    // =====================================================
    // FALLBACK JOB MATCHING
    // =====================================================

    private Map<String, Object> fallbackMatch(

            String resume,

            String job

    ) {

        String resumeText =
                resume.toLowerCase();

        String jobText =
                job.toLowerCase();


        List<String> terms =
                List.of(

                        "java",

                        "spring boot",

                        "react",

                        "javascript",

                        "typescript",

                        "mysql",

                        "sql",

                        "rest api",

                        "git",

                        "docker",

                        "aws",

                        "python",

                        "mongodb",

                        "redis",

                        "junit"
                );


        List<String> matched =

                terms.stream()

                        .filter(
                                term ->
                                        jobText.contains(term)
                                                &&
                                                resumeText.contains(term)
                        )

                        .toList();


        List<String> missing =

                terms.stream()

                        .filter(
                                term ->
                                        jobText.contains(term)
                                                &&
                                                !resumeText.contains(term)
                        )

                        .toList();


        long required =

                terms.stream()

                        .filter(
                                jobText::contains
                        )

                        .count();


        int score =

                required == 0

                        ? 0

                        : (int) Math.round(

                        matched.size()
                        * 100.0
                        / required
                );


        return Map.of(

                "matchScore",
                score,

                "matchedSkills",
                matched,

                "missingSkills",
                missing,

                "analysis",
                "Keyword matching was used because no AI API key is configured."
        );
    }


    // =====================================================
    // FALLBACK CAREER ROADMAP
    // =====================================================

    private Map<String, Object> fallbackRoadmap(

            String targetRole,

            String level

    ) {

        return Map.of(

                "targetRole",
                targetRole,

                "currentLevel",
                level,

                "steps",
                List.of(

                        Map.of(

                                "title",
                                "Core Java",

                                "status",
                                "review",

                                "skills",
                                List.of(
                                        "Collections",
                                        "Streams",
                                        "Concurrency"
                                )
                        ),

                        Map.of(

                                "title",
                                "Spring Boot",

                                "status",
                                "build",

                                "skills",
                                List.of(
                                        "REST APIs",
                                        "Security",
                                        "JPA"
                                )
                        ),

                        Map.of(

                                "title",
                                "Cloud & DevOps",

                                "status",
                                "learn",

                                "skills",
                                List.of(
                                        "Docker",
                                        "AWS",
                                        "CI/CD"
                                )
                        ),

                        Map.of(

                                "title",
                                "System Design",

                                "status",
                                "learn",

                                "skills",
                                List.of(
                                        "Caching",
                                        "Queues",
                                        "Scalability"
                                )
                        )
                )
        );
    }
}