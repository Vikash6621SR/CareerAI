package com.careerai.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public final class ApplicationDtos {

    private ApplicationDtos() {
    }

    public record CreateRequest(

            @NotNull
            Long jobId,

            @NotNull
            String status,

            LocalDate appliedDate,

            LocalDate interviewDate,

            String notes

    ) {
    }

    public record UpdateRequest(

            @NotNull
            String status,

            LocalDate appliedDate,

            LocalDate interviewDate,

            String notes

    ) {
    }
}