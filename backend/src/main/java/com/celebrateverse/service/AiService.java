package com.celebrateverse.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.util.UriComponentsBuilder;
import com.celebrateverse.dto.request.GenerateMessageRequest;
import com.celebrateverse.dto.response.AiMessageResponse;

import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class AiService {

    @Value("${ai.api-key}")
    private String apiKey;

    @Value("${ai.endpoint}")
    private String aiEndpoint;

    public AiMessageResponse generateMessage(GenerateMessageRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        String url = UriComponentsBuilder.fromHttpUrl(aiEndpoint)
                .queryParam("key", apiKey)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = String.format("Write a %s birthday message for %s. Relationship: %s. Keep it under 500 characters and very cinematic/heartfelt.", 
                request.getTone(), request.getRecipientName(), request.getRelationship());

        // Gemini REST API specific request body format
        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        
        part.put("text", prompt);
        parts.add(part);
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> respContent = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> respParts = (List<Map<String, Object>>) respContent.get("parts");
                    if (!respParts.isEmpty()) {
                        String generatedText = (String) respParts.get(0).get("text");
                        return new AiMessageResponse(generatedText);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return new AiMessageResponse("Happy birthday! Wishing you a cinematic and wonderful year ahead!");
    }

    public AiMessageResponse generateAvatar() {
        return new AiMessageResponse("https://api.dicebear.com/7.x/avataaars/svg?seed=celebrateverse");
    }
}
