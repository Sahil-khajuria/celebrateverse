package com.celebrateverse.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EngagementEventRequest {
    @NotBlank
    private String eventType;
}
