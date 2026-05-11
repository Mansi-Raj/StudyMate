package com.mansirajprojects.studymate_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity marks this class as a JPA entity, meaning it maps directly to a database table.
@Entity
@Table(name = "users") // Explicitly naming the table 'users'
public class User {
    
    // @Id denotes the primary key. GenerationType.IDENTITY tells MySQL to auto-increment it.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // unique = true ensures no two users can have the same username
    @Column(unique = true, nullable = false)
    private String username;

    // This will store the hashed password, never the plain text!
    @Column(nullable = false)
    private String password;

    // Defines the user's permissions (e.g., "ROLE_USER" or "ROLE_ADMIN")
    private String role; 

    // Standard Getters and Setters so JPA and Spring can access/modify the fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}