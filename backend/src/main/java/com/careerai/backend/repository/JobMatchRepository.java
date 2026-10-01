package com.careerai.backend.repository;

import com.careerai.backend.entity.JobMatch;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobMatchRepository
        extends JpaRepository<JobMatch, Long> {

    List<JobMatch> findByUserIdOrderByMatchedAtDesc(
            Long userId
    );

    Optional<JobMatch> findByResumeIdAndJobId(
            Long resumeId,
            Long jobId
    );
}