package com.celebrateverse.controller;

import com.celebrateverse.dto.request.GenerateMessageRequest;
import com.celebrateverse.dto.response.AiMessageResponse;
import com.celebrateverse.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate-message")
    public ResponseEntity<AiMessageResponse> generateMessage(@RequestBody GenerateMessageRequest request) {
        return ResponseEntity.ok(aiService.generateMessage(request));
    }

    @PostMapping("/generate-avatar")
    public ResponseEntity<AiMessageResponse> generateAvatar() {
        return ResponseEntity.ok(aiService.generateAvatar());
    }
}
