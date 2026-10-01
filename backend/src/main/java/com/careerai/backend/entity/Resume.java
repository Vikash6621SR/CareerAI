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
        name = "resumes",
        indexes = {
                @Index(
                        name = "idx_resumes_user",
                        columnList = "user_id"
                ),
                @Index(
                        name = "idx_resumes_uploaded_at",
                        columnList = "uploaded_at"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

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
    private User user;

    @Column(
            nullable = false,
            length = 255
    )
    private String fileName;

    @Column(length = 100)
    private String fileType;

    private Long fileSize;

    @Lob
    @Column(
            columnDefinition = "LONGTEXT"
    )
    private String parsedText;

    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {

        if (uploadedAt == null) {
            uploadedAt =
                    LocalDateTime.now();
        }
    }
}