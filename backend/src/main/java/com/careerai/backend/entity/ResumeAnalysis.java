package com.careerai.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "resume_analysis",
        indexes = {
                @Index(
                        name = "idx_resume_analysis_resume",
                        columnList = "resume_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "resume_id",
            nullable = false,
            unique = true
    )
    private Resume resume;

    private Integer atsScore;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String summary;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String strengthsJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String weaknessesJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String missingSkillsJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String recommendationsJson;

    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String keywordsJson;

    @Column(nullable = false)
    private LocalDateTime analyzedAt;

    @PrePersist
    protected void onCreate() {

        if (analyzedAt == null) {
            analyzedAt =
                    LocalDateTime.now();
        }
    }
}