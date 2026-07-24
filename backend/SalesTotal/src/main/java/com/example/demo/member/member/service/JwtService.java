package com.example.demo.member.member.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey key =
        Keys.hmacShaKeyFor(
            "my-secret-key-my-secret-key-my-secret-key"
            .getBytes()
        );


    public String createAccessToken(Long userId) {

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .expiration(
                    new Date(
                        System.currentTimeMillis()
                        + 1000 * 60 * 15
                    )
                )
                .signWith(key)
                .compact();
    }


    public Long getUserId(String token) {

        Claims claims =
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();


        return Long.parseLong(
            claims.getSubject()
        );
    }
}