package com.careerai.backend.controller;

import com.careerai.backend.dto.AuthDtos.UserResponse;
import com.careerai.backend.security.CurrentUser;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final CurrentUser currentUser;

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication
    ) {

        var user =
                currentUser.get(
                        authentication
                );

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