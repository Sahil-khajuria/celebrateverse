package com.celebrateverse.dto.request;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CreatePageRequest {
    private String recipientName;
    private String recipientNickname;
    private Integer recipientAge;
    private LocalDate recipientBirthday;
    private String favoriteColor;
    private String favoriteMusicGenre;
    private String senderName;
    private String senderRelationship;
    private String personalMessage;
    private String theme = "classic_gold";
    private String cakeTheme = "default";
    private String mode = "QUICK";
    private Boolean isPasswordProtected = false;
    private String pagePassword;
    private LocalDateTime revealAt;
    private Boolean isCalmModeDefault = false;
}
