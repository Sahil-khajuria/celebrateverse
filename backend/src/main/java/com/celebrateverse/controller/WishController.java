package com.celebrateverse.controller;

import com.celebrateverse.dto.request.CreateWishRequest;
import com.celebrateverse.dto.response.WishResponse;
import com.celebrateverse.service.RateLimiterService;
import com.celebrateverse.service.WishService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pages/{slug}/wishes")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;
    private final RateLimiterService rateLimiterService;

    @GetMapping
    public ResponseEntity<List<WishResponse>> getWishes(@PathVariable String slug) {
        return ResponseEntity.ok(wishService.getApprovedWishes(slug));
    }

    @PostMapping
    public ResponseEntity<?> createWish(
            @PathVariable String slug,
            @Valid @RequestBody CreateWishRequest request,
            HttpServletRequest httpRequest) {
        
        String ipAddress = httpRequest.getRemoteAddr();
        Bucket bucket = rateLimiterService.resolveBucket(ipAddress);
        
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(wishService.createWish(slug, request));
        }
        
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Too many requests. Please try again later.");
    }
}

// Separate controller mapping for DELETE to handle ID based properly as requested in requirements.
@RestController
@RequestMapping("/api/v1/wishes")
@RequiredArgsConstructor
class WishAdminController {
    
    private final WishService wishService;
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWish(@PathVariable Long id) {
        wishService.deleteWish(id);
        return ResponseEntity.noContent().build();
    }
}
