package com.careerai.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;

    private final long expiration;

    public JwtService(

            @Value("${app.jwt.secret}")
            String secret,

            @Value("${app.jwt.expiration-ms}")
            long expiration

    ) {

        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {

            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 characters"
            );
        }

        this.key =
                Keys.hmacShaKeyFor(
                        secret.getBytes(StandardCharsets.UTF_8)
                );

        this.expiration = expiration;
    }


    public String generate(
            Long userId,
            String email
    ) {

        Date now = new Date();

        return Jwts.builder()

                .subject(email)

                .claim(
                        "userId",
                        userId
                )

                .issuedAt(now)

                .expiration(
                        new Date(
                                now.getTime()
                                        + expiration
                        )
                )

                .signWith(key)

                .compact();
    }


    public String getEmail(
            String token
    ) {

        return parse(token)
                .getPayload()
                .getSubject();
    }


    public boolean isValid(
            String token
    ) {

        try {

            parse(token);

            return true;

        } catch (Exception exception) {

            return false;
        }
    }


    private Jws<Claims> parse(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token);
    }
}