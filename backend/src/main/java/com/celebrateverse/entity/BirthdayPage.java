package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="birthday_pages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BirthdayPage {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="owner_user_id", nullable=false)
    private User ownerUser;

    private String recipientName;
    private String recipientNickname;
    private Integer recipientAge;
    private LocalDate recipientBirthday;
    private String favoriteColor;
    private String favoriteMusicGenre;
    private String senderName;
    private String senderRelationship;
    
    @Column(columnDefinition="TEXT")
    private String personalMessage;
    
    @Builder.Default
    private String theme = "classic_gold";
    
    @Builder.Default
    private String cakeTheme = "default";
    
    @Builder.Default
    private String mode = "QUICK";
    
    @Builder.Default
    private Boolean isPasswordProtected = false;
    
    private String pagePasswordHash;
    private LocalDateTime revealAt;
    
    @Builder.Default
    private Boolean isCalmModeDefault = false;
    
    @Builder.Default
    private Integer viewCount = 0;
    
    @Builder.Default
    private Boolean isPublished = false;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "page", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private java.util.List<MediaAsset> mediaAssets;
}
