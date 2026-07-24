package com.celebrateverse.controller;

import com.celebrateverse.dto.request.ReorderMediaRequest;
import com.celebrateverse.dto.response.MediaAssetResponse;
import com.celebrateverse.entity.MediaAsset;
import com.celebrateverse.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/pages/{pageId}/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping
    public ResponseEntity<MediaAssetResponse> uploadMedia(
            @PathVariable Long pageId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") MediaAsset.MediaType type,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(mediaService.uploadMedia(pageId, file, type, userDetails.getUsername()));
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable Long pageId,
            @PathVariable Long mediaId,
            @AuthenticationPrincipal UserDetails userDetails) {
        mediaService.deleteMedia(pageId, mediaId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderMedia(
            @PathVariable Long pageId,
            @RequestBody ReorderMediaRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        mediaService.reorderMedia(pageId, request, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}
