package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="media_assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaAsset {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="page_id", nullable=false)
    private BirthdayPage page;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private MediaType type;

    @Lob
    @Column(nullable=false, columnDefinition="LONGTEXT")
    private String url;

    @Builder.Default
    private Integer sortOrder = 0;

    @Column(length = 255)
    private String cloudinaryPublicId;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum MediaType { PHOTO, VIDEO, MUSIC, SLIDESHOW_MUSIC, VOICE_NOTE, GIF, STICKER, BALLOON_PHOTO }
}
