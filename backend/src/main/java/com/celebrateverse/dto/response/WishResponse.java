package com.celebrateverse.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WishResponse {
    private Long id;
    private String authorName;
    private String message;
    private String photoUrl;
    private String reactionEmoji;
    private LocalDateTime createdAt;
}
