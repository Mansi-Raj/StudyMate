package com.mansirajprojects.studymate_backend.controller.dto;

// Using a record makes this immutable and automatically generates getters, toString, etc.
public record AuthRequest(String username, String password) {
}