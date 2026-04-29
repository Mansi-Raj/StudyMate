package com.mansirajprojects.studymate_backend.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mansirajprojects.studymate_backend.model.ChatMessage;
import com.mansirajprojects.studymate_backend.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200") // Connects to Angular
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatMessage sendMessage(@RequestBody Map<String, String> payload) {
        String prompt = payload.get("prompt");
        return chatService.processChatMessage(prompt);
    }
}