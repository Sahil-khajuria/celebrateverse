package com.celebrateverse.controller;

import com.celebrateverse.dto.request.CreatePageRequest;
import com.celebrateverse.dto.request.PasswordRequest;
import com.celebrateverse.dto.request.UpdatePageRequest;
import com.celebrateverse.dto.request.VerifyPasswordRequest;
import com.celebrateverse.dto.response.PageResponse;
import com.celebrateverse.dto.response.PageSummaryResponse;
import com.celebrateverse.dto.response.PublicPageResponse;
import com.celebrateverse.dto.response.VerifyPasswordResponse;
import com.celebrateverse.service.PageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pages")
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    @PostMapping
    public ResponseEntity<PageResponse> createPage(
            @Valid @RequestBody CreatePageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pageService.createPage(request, userDetails.getUsername()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PublicPageResponse> getPage(@PathVariable String slug) {
        return ResponseEntity.ok(pageService.getBySlug(slug));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<PageResponse> updatePage(
            @PathVariable String slug,
            @Valid @RequestBody UpdatePageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pageService.updatePage(slug, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deletePage(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails) {
        pageService.deletePage(slug, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{slug}/publish")
    public ResponseEntity<PageResponse> publishPage(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pageService.publishPage(slug, userDetails.getUsername()));
    }

    @GetMapping(value = "/{slug}/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable String slug) {
        return ResponseEntity.ok(pageService.getQrCode(slug));
    }

    @PostMapping("/{slug}/password")
    public ResponseEntity<Void> setPassword(
            @PathVariable String slug,
            @Valid @RequestBody PasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        pageService.setPassword(slug, request.getPassword(), userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{slug}/verify-password")
    public ResponseEntity<VerifyPasswordResponse> verifyPassword(
            @PathVariable String slug,
            @Valid @RequestBody VerifyPasswordRequest request) {
        boolean valid = pageService.verifyPassword(slug, request.getPassword());
        return ResponseEntity.ok(new VerifyPasswordResponse(valid));
    }

    @GetMapping("/dashboard/pages")
    public ResponseEntity<List<PageSummaryResponse>> getDashboardPages(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(pageService.getDashboardPages(userDetails.getUsername()));
    }
}
