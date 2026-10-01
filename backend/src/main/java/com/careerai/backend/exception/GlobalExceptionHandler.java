package com.careerai.backend.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.*;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log =
            LoggerFactory.getLogger(
                    GlobalExceptionHandler.class
            );

    // =====================================================
    // ERROR RESPONSE
    // =====================================================

    public record ErrorResponse(

            LocalDateTime timestamp,

            int status,

            String error,

            String message

    ) {
    }

    // =====================================================
    // 404
    // =====================================================

    @ExceptionHandler(
            ResourceNotFoundException.class
    )
    public ResponseEntity<ErrorResponse> handleNotFound(

            ResourceNotFoundException exception

    ) {

        return build(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }

    // =====================================================
    // 400
    // =====================================================

    @ExceptionHandler(
            BadRequestException.class
    )
    public ResponseEntity<ErrorResponse> handleBadRequest(

            BadRequestException exception

    ) {

        return build(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ErrorResponse> handleValidation(

            MethodArgumentNotValidException exception

    ) {

        String message =
                exception
                        .getBindingResult()
                        .getFieldErrors()
                        .stream()
                        .map(
                                error ->
                                        error.getField()
                                                + ": "
                                                + error.getDefaultMessage()
                        )
                        .collect(
                                Collectors.joining(", ")
                        );

        return build(
                HttpStatus.BAD_REQUEST,
                message
        );
    }

    // =====================================================
    // ILLEGAL ARGUMENT
    // =====================================================

    @ExceptionHandler(
            IllegalArgumentException.class
    )
    public ResponseEntity<ErrorResponse> handleIllegalArgument(

            IllegalArgumentException exception

    ) {

        return build(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }

    // =====================================================
    // GENERAL ERROR
    // =====================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(

            Exception exception

    ) {

        /*
         * Do not expose the stack trace to the client.
         * Log it on the backend instead.
         */

        log.error(
                "Unexpected server error",
                exception
        );

        return build(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected server error occurred"
        );
    }

    // =====================================================
    // BUILD RESPONSE
    // =====================================================

    private ResponseEntity<ErrorResponse> build(

            HttpStatus status,

            String message

    ) {

        return ResponseEntity

                .status(status)

                .body(
                        new ErrorResponse(

                                LocalDateTime.now(),

                                status.value(),

                                status.getReasonPhrase(),

                                message
                        )
                );
    }
}