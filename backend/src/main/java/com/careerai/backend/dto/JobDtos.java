package com.careerai.backend.dto;

import jakarta.validation.constraints.NotBlank;

public final class JobDtos {

    private JobDtos() {
    }

    public record CreateJobRequest(

            @NotBlank
            String title,

            @NotBlank
            String company,

            String location,

            String sourceUrl,

            @NotBlank
            String description

    ) {
    }

    public record JobResponse(
            Long id,
            String title,
            String company,
            String location,
            String sourceUrl,
            String description
    ) {
    }
}