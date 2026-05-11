package com.mansirajprojects.studymate_backend.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

// @Component makes this a Spring Bean so we can inject it anywhere using @Autowired
@Component
public class JwtUtil {
    // Generates a cryptographically secure key to sign the JWTs. 
    // Note: In production, store a static secret key in application.properties!
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // Token validity duration (10 hours in milliseconds)
    private final long JWT_EXPIRATION = 1000 * 60 * 60 * 10; 

    // Creates the actual JWT string
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // The payload (who the token belongs to)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Creation time
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION)) // Expiry time
                .signWith(SECRET_KEY) // Cryptographic signature to prevent tampering
                .compact();
    }

    // Extracts the username (Subject) from a given token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Generic method to extract any specific piece of data (claim) from the token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
        return claimsResolver.apply(claims);
    }

    // Verifies that the token belongs to the user trying to use it AND hasn't expired
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}