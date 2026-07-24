package com.celebrateverse.controller;

import com.celebrateverse.dto.request.LoginRequest;
import com.celebrateverse.dto.request.RefreshTokenRequest;
import com.celebrateverse.dto.request.RegisterRequest;
import com.celebrateverse.dto.response.AuthResponse;
import com.celebrateverse.dto.response.GuestTokenResponse;
import com.celebrateverse.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/guest-token")
    public ResponseEntity<GuestTokenResponse> guestToken() {
        return ResponseEntity.ok(authService.getGuestToken());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
}
