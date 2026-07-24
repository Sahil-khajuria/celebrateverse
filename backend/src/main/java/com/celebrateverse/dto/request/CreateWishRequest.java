package com.celebrateverse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateWishRequest {
    private String authorName = "Anonymous";

    @NotBlank
    @Size(max = 500)
    private String message;

    private String reactionEmoji;
}
