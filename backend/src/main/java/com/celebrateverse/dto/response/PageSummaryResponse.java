package com.celebrateverse.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PageSummaryResponse {
    private Long id;
    private String slug;
    private String recipientName;
    private String theme;
    private Integer viewCount;
    private Long wishCount;
    private LocalDateTime createdAt;
    private String shareUrl;
}
