package com.mansirajprojects.studymate_backend.controller.dto;
// A 'record' is a lightweight, immutable data carrier perfect for receiving JSON request bodies
public record AuthRequest(String username, String password) {}