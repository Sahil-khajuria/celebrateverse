package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name="engagement_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementEvent {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="page_id", nullable=false)
    private BirthdayPage page;

    @Column(nullable=false)
    private String eventType;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
