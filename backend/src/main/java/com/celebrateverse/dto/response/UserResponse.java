package com.celebrateverse.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String displayName;
    private String role;
}
