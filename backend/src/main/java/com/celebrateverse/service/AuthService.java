package com.celebrateverse.service;

import com.celebrateverse.dto.request.LoginRequest;
import com.celebrateverse.dto.request.RegisterRequest;
import com.celebrateverse.dto.response.AuthResponse;
import com.celebrateverse.dto.response.GuestTokenResponse;
import com.celebrateverse.entity.User;
import com.celebrateverse.mapper.UserMapper;
import com.celebrateverse.repository.UserRepository;
import com.celebrateverse.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public AuthResponse register(RegisterRequest request) {
        User user = userService.register(request);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .expiresIn(jwtExpiration)
                .user(userMapper.toResponse(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.loadByEmail(request.getEmail());
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .expiresIn(jwtExpiration)
                .user(userMapper.toResponse(user))
                .build();
    }

    public GuestTokenResponse getGuestToken() {
        String guestEmail = "guest_" + UUID.randomUUID().toString() + "@celebrateverse.local";
        User guest = User.builder()
                .email(guestEmail)
                .role(User.Role.CREATOR)
                .isGuest(true)
                .build();
        userRepository.save(guest);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(guestEmail)
                .password("")
                .roles("CREATOR")
                .build();
                
        String token = jwtTokenProvider.generateToken(userDetails);
        return new GuestTokenResponse(token, guest.getId());
    }

    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtTokenProvider.extractUsername(refreshToken);
        if (username != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtTokenProvider.isTokenValid(refreshToken, userDetails)) {
                User user = userService.loadByEmail(username);
                String newToken = jwtTokenProvider.generateToken(userDetails);
                
                return AuthResponse.builder()
                        .token(newToken)
                        .refreshToken(refreshToken)
                        .expiresIn(jwtExpiration)
                        .user(userMapper.toResponse(user))
                        .build();
            }
        }
        throw new RuntimeException("Invalid refresh token");
    }
}
