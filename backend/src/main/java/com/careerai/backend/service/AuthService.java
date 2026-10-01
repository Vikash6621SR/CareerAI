package com.careerai.backend.service;

import com.careerai.backend.dto.AuthDtos.*;
import com.careerai.backend.entity.User;
import com.careerai.backend.exception.BadRequestException;
import com.careerai.backend.repository.UserRepository;
import com.careerai.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    // =====================================================
    // REGISTER
    // =====================================================

    public AuthResponse register(
            RegisterRequest request
    ) {

        String email =
                request.email()
                        .trim()
                        .toLowerCase();

        if (userRepository.existsByEmail(email)) {

            throw new BadRequestException(
                    "Email is already registered"
            );
        }

        if (request.password() == null
                || request.password().isBlank()) {

            throw new BadRequestException(
                    "Password is required"
            );
        }

        if (request.password().length() < 8) {

            throw new BadRequestException(
                    "Password must contain at least 8 characters"
            );
        }

        User user =
                User.builder()

                        .name(
                                request.name()
                                        .trim()
                        )

                        .email(email)

                        .password(
                                passwordEncoder.encode(
                                        request.password()
                                )
                        )

                        .enabled(true)

                        .build();

        user =
                userRepository.save(user);

        String token =
                jwtService.generate(
                        user.getId(),
                        user.getEmail()
                );

        return new AuthResponse(
                token,
                toResponse(user)
        );
    }

    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(
            LoginRequest request
    ) {

        String email =
                request.email()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new BadRequestException(
                                        "Invalid email or password"
                                )
                        );

        // -------------------------------------------------
        // Check account status
        // -------------------------------------------------

        if (!user.isEnabled()) {

            throw new BadRequestException(
                    "User account is disabled"
            );
        }

        // -------------------------------------------------
        // Check password
        // -------------------------------------------------

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {

            throw new BadRequestException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generate(
                        user.getId(),
                        user.getEmail()
                );

        return new AuthResponse(
                token,
                toResponse(user)
        );
    }

    // =====================================================
    // USER RESPONSE
    // =====================================================

    public UserResponse toResponse(
            User user
    ) {

        return new UserResponse(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getPhone(),

                user.getHeadline(),

                user.getTargetRole()
        );
    }
}