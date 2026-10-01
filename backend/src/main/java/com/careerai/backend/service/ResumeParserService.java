package com.careerai.backend.service;

import com.careerai.backend.exception.BadRequestException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;

import org.apache.poi.xwpf.usermodel.XWPFDocument;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeParserService {

    public String parse(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {

            throw new BadRequestException(
                    "Resume file is required"
            );
        }

        String fileName =
                file.getOriginalFilename() == null
                        ? ""
                        : file.getOriginalFilename()
                        .toLowerCase();

        try {

            if (fileName.endsWith(".pdf")) {

                return parsePdf(file);
            }

            if (fileName.endsWith(".docx")) {

                return parseDocx(file);
            }

            throw new BadRequestException(
                    "Only PDF and DOCX resumes are supported"
            );

        } catch (BadRequestException exception) {

            throw exception;

        } catch (Exception exception) {

            throw new BadRequestException(
                    "Could not read the resume file"
            );
        }
    }

    private String parsePdf(
            MultipartFile file
    ) throws Exception {

        try (
                var document =
                        Loader.loadPDF(
                                file.getBytes()
                        )
        ) {

            return new PDFTextStripper()
                    .getText(document)
                    .trim();
        }
    }

    private String parseDocx(
            MultipartFile file
    ) throws Exception {

        try (
                var document =
                        new XWPFDocument(
                                file.getInputStream()
                        )
        ) {

            StringBuilder text =
                    new StringBuilder();

            document
                    .getParagraphs()
                    .forEach(paragraph -> {

                        if (!paragraph
                                .getText()
                                .isBlank()) {

                            text.append(
                                    paragraph.getText()
                            );

                            text.append("\n");
                        }
                    });

            document
                    .getTables()
                    .forEach(table ->
                            table.getRows()
                                    .forEach(row ->
                                            row.getTableCells()
                                                    .forEach(cell -> {

                                                        text.append(
                                                                cell.getText()
                                                        );

                                                        text.append(" | ");
                                                    })
                                    )
                    );

            return text
                    .toString()
                    .trim();
        }
    }
}