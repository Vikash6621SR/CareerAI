package com.careerai.backend.repository;

import com.careerai.backend.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CareerRoadmapRepository
        extends JpaRepository<CareerRoadmap, Long> {

    Optional<CareerRoadmap> findByUserId(Long userId);
}