package com.mansirajprojects.studymate_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mansirajprojects.studymate_backend.controller.dto.AuthRequest;
import com.mansirajprojects.studymate_backend.controller.dto.AuthResponse;
import com.mansirajprojects.studymate_backend.model.User;
import com.mansirajprojects.studymate_backend.repository.UserRepository;
import com.mansirajprojects.studymate_backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth") // Base URL for all endpoints in this class
@CrossOrigin(origins = "http://localhost:4200") // Specifically allowing the Angular frontend origin
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Handles User Login
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authenticationRequest) {
        try {
            // Attempt to authenticate using Spring's built-in manager
            // This will automatically hash the incoming password and compare it to the DB
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.username(), authenticationRequest.password())
            );
        } catch (BadCredentialsException e) {
            // If passwords don't match, return 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }

        // If authentication passes, load the user details...
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.username());
        
        // ...generate a fresh JWT...
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // ...and send it back to Angular!
        return ResponseEntity.ok(new AuthResponse(jwt));
    }

    // Handles New User Registration
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest request) {
        // Security Check: Make sure the username isn't already taken
        if (userRepository.findByUsername(request.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        // Create a new User entity
        User newUser = new User();
        newUser.setUsername(request.username());
        
        // CRITICAL: We must hash the password before saving it to MySQL. Never save plain text!
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setRole("ROLE_USER"); // Assign default permissions

        // Save to the database
        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully");
    }
}