package com.careerai.backend.repository;

import com.careerai.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByUserIdOrderByUpdatedAtDesc(
            Long userId
    );

    Optional<Application> findByIdAndUserId(
            Long id,
            Long userId
    );
}