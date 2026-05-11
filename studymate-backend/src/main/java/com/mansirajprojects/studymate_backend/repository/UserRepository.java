package com.mansirajprojects.studymate_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mansirajprojects.studymate_backend.model.User;

// JpaRepository gives us built-in methods like save(), findAll(), findById() without writing SQL.
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Custom query method. Spring Data JPA automatically writes the SQL query 
    // to find a user by their exact username. Returns an Optional to handle nulls gracefully.
    Optional<User> findByUsername(String username);
}