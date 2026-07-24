package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="share_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareToken {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="page_id", nullable=false)
    private BirthdayPage page;

    @Column(unique=true, nullable=false)
    private String token;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
