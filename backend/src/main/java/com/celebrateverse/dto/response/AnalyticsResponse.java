package com.celebrateverse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Integer viewCount;
    private Long wishCount;
    private Long candleBlownCount;
    private Long replayCount;
    private Long heartCount;
    private Long totalEngagements;
}
