package com.careerai.backend.service;

import com.careerai.backend.entity.Resume;
import com.careerai.backend.entity.User;

import com.careerai.backend.exception.BadRequestException;
import com.careerai.backend.exception.ResourceNotFoundException;

import com.careerai.backend.repository.ResumeAnalysisRepository;
import com.careerai.backend.repository.ResumeRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    private final ResumeAnalysisRepository analysisRepository;

    private final ResumeParserService parserService;

    public Resume upload(
            User user,
            MultipartFile file
    ) {

        String fileName =
                file.getOriginalFilename() == null
                        ? "resume"
                        : file.getOriginalFilename();

        String lowerName =
                fileName.toLowerCase();

        String fileType;

        if (lowerName.endsWith(".pdf")) {

            fileType = "PDF";

        } else if (lowerName.endsWith(".docx")) {

            fileType = "DOCX";

        } else {

            throw new BadRequestException(
                    "Only PDF and DOCX resumes are supported"
            );
        }

        String parsedText =
                parserService.parse(file);

        if (parsedText.isBlank()) {

            throw new BadRequestException(
                    "No readable text was found in the resume"
            );
        }

        Resume resume =
                Resume.builder()

                        .user(user)

                        .fileName(fileName)

                        .fileType(fileType)

                        .fileSize(file.getSize())

                        .parsedText(parsedText)

                        .build();

        return resumeRepository.save(resume);
    }

    public List<Resume> list(
            User user
    ) {

        return resumeRepository
                .findByUserIdOrderByUploadedAtDesc(
                        user.getId()
                );
    }

    public Resume owned(
            User user,
            Long id
    ) {

        return resumeRepository
                .findByIdAndUserId(
                        id,
                        user.getId()
                )

                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Resume not found"
                        )
                );
    }

    public void delete(
            User user,
            Long id
    ) {

        Resume resume =
                owned(user, id);

        analysisRepository
                .findByResumeId(id)
                .ifPresent(
                        analysisRepository::delete
                );

        resumeRepository.delete(resume);
    }
}