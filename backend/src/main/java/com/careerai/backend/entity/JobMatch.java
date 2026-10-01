package com.careerai.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "job_matches",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_job_match_resume_job",
                        columnNames = {
                                "resume_id",
                                "job_id"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_job_matches_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_job_matches_resume",
                        columnList = "resume_id"
                ),
                @Index(
                        name = "idx_job_matches_job",
                        columnList = "job_id"
                ),
                @Index(
                        name = "idx_job_matches_matched_at",
                        columnList = "matched_at"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    @JsonIgnore
    private User user;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "resume_id",
            nullable = false
    )
    @JsonIgnore
    private Resume resume;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "job_id",
            nullable = false
    )
    @JsonIgnore
    private Job job;

    @Column(nullable = false)
    private Integer matchScore;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String matchedSkillsJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String missingSkillsJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String analysisJson;

    @Column(nullable = false)
    private LocalDateTime matchedAt;

    @PrePersist
    protected void onCreate() {

        if (matchedAt == null) {
            matchedAt =
                    LocalDateTime.now();
        }
    }
}