package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="wishes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wish {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="page_id", nullable=false)
    private BirthdayPage page;

    @Builder.Default
    private String authorName = "Anonymous";

    @Column(columnDefinition="TEXT", nullable=false)
    private String message;

    @Column(length=500)
    private String photoUrl;

    @Column(length=20)
    private String reactionEmoji;

    @Builder.Default
    private Boolean isApproved = true;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
