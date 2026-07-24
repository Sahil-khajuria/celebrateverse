package com.celebrateverse.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PageResponse {
    private Long id;
    private String slug;
    private String shareUrl;
    private String qrCodeUrl;
    private String recipientName;
    private String recipientNickname;
    private Integer recipientAge;
    private LocalDate recipientBirthday;
    private String favoriteColor;
    private String favoriteMusicGenre;
    private String senderName;
    private String senderRelationship;
    private String personalMessage;
    private String theme;
    private String cakeTheme;
    private String mode;
    private Boolean isPasswordProtected;
    private LocalDateTime revealAt;
    private Boolean isCalmModeDefault;
    private Integer viewCount;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    
    private List<MediaAssetResponse> mediaAssets;
}
