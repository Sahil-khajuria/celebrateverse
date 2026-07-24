package com.celebrateverse.controller;

import com.celebrateverse.dto.request.EngagementEventRequest;
import com.celebrateverse.dto.response.AnalyticsResponse;
import com.celebrateverse.service.EngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pages")
@RequiredArgsConstructor
public class EngagementController {

    private final EngagementService engagementService;

    @PostMapping("/{slug}/events")
    public ResponseEntity<Void> logEvent(
            @PathVariable String slug,
            @Valid @RequestBody EngagementEventRequest request) {
        engagementService.logEvent(slug, request.getEventType());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(engagementService.getAnalytics(id));
    }
}
