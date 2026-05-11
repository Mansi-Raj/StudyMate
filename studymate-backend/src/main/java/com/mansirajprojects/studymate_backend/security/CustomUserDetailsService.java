package com.mansirajprojects.studymate_backend.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mansirajprojects.studymate_backend.model.User;
import com.mansirajprojects.studymate_backend.repository.UserRepository;

// This service acts as the bridge between your MySQL database and Spring Security's core logic
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Spring Security calls this method during login to fetch the user's details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Step 1: Look up the user in our database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Step 2: Convert our custom User entity into Spring Security's UserDetails object
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(), // Spring will automatically check if the incoming password matches this hashed one
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}