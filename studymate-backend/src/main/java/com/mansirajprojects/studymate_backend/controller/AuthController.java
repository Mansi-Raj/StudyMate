package com.mansirajprojects.studymate_backend.controller;

import com.mansirajprojects.studymate_backend.controller.dto.AuthRequest;
import com.mansirajprojects.studymate_backend.controller.dto.AuthResponse;
import com.mansirajprojects.studymate_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular frontend to call this endpoint
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authenticationRequest) {
        try {
            // 1. Authenticate the user credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.username(), 
                            authenticationRequest.password()
                    )
            );
        } catch (BadCredentialsException e) {
            // If authentication fails, return a 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }

        // 2. If successful, load the user details
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.username());

        // 3. Generate the JWT
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // 4. Return the JWT in the response body
        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}