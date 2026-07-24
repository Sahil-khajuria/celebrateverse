package com.celebrateverse.dto.response;

import lombok.Data;

@Data
public class MediaAssetResponse {
    private Long id;
    private String type;
    private String url;
    private Integer sortOrder;
}
