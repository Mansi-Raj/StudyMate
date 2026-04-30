package com.mansirajprojects.studymate_backend.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mansirajprojects.studymate_backend.model.ChatMessage;
import com.mansirajprojects.studymate_backend.repository.ChatMessageRepository;

@Service
public class ChatService {

    private final ChatMessageRepository repository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public ChatService(ChatMessageRepository repository) {
        this.repository = repository;
        this.restTemplate = new RestTemplate();
    }

    public ChatMessage processChatMessage(String userPrompt) {
        // 1. Save User Message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setRole("user");
        userMessage.setContent(userPrompt);
        userMessage.setTimestamp(LocalDateTime.now());
        repository.save(userMessage);

        // 2. Call Gemini API
        String aiResponseText = callGeminiApi(userPrompt);

        // 3. Save AI Response
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setRole("ai");
        aiMessage.setContent(aiResponseText);
        aiMessage.setTimestamp(LocalDateTime.now());
        return repository.save(aiMessage);
    }

    private String callGeminiApi(String prompt) {
        String url = geminiApiUrl + "?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Escape special characters so the JSON string doesn't break
        String sanitizedPrompt = prompt.replace("\\", "\\\\")
                                       .replace("\"", "\\\"")
                                       .replace("\n", "\\n");

        // Updated requestBody to include system instructions
        String requestBody = """
                {
                  "systemInstruction": {
                    "parts": [{"text": "You are StudyMate, a helpful, encouraging, and highly knowledgeable AI study assistant. Your goal is to help the user learn and understand concepts clearly. When a user asks you to explain a topic, provide a comprehensive, well-structured, and easy-to-understand overview. You MUST use Markdown formatting, including bold text, bullet points, and code blocks, to make your answers as readable and engaging as possible."}]
                  },
                  "contents": [{
                    "parts": [{"text": "%s"}]
                  }]
                }
                """.formatted(sanitizedPrompt);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            Map response = restTemplate.postForObject(url, request, Map.class);
            Map candidate = (Map) ((java.util.List) response.get("candidates")).get(0);
            Map content = (Map) candidate.get("content");
            Map part = (Map) ((java.util.List) content.get("parts")).get(0);
            return (String) part.get("text");
            
        } catch (org.springframework.web.client.HttpClientErrorException.TooManyRequests e) {
            // This catches the exact error when you cross the free tier rate limit
            System.err.println("Hit Gemini Free Tier Rate Limit!");
            return "StudyMate is taking a quick breather! I've hit my free usage limit for this minute. Please try asking again in about 60 seconds.";
            
        } catch (Exception e) {
            // This catches any other random errors (like no internet connection)
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return "Sorry, I am having trouble connecting to my AI brain right now. Please try again later.";
        }
    }
}