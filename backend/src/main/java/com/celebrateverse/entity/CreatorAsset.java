package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="creator_assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatorAsset {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="page_id", nullable=false, unique=true)
    private BirthdayPage page;

    @Column(nullable=false, length=500)
    private String url;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
