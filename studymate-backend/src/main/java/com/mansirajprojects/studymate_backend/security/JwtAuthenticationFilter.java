package com.mansirajprojects.studymate_backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// This filter intercepts EVERY incoming HTTP request to check if it has a valid JWT
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Step 1: Look for the "Authorization" header in the HTTP request
        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Step 2: Check if the header exists and starts with "Bearer " (standard JWT format)
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Remove "Bearer " to get just the token string
            username = jwtUtil.extractUsername(jwt); // Decode the token to see who it belongs to
        }

        // Step 3: If we found a username, but the user isn't logged into the Spring Context yet...
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Step 4: Verify the token is mathematically valid and not expired
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                
                // Step 5: Tell Spring Security "This user is fully authenticated for this request"
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // Step 6: Continue sending the request down the chain to the actual Controller
        chain.doFilter(request, response);
    }
}