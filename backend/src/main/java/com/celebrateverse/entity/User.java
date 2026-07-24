package com.celebrateverse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true)
    private String email;

    private String passwordHash;
    private String displayName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.CREATOR;

    @Builder.Default
    private boolean isGuest = false;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum Role { CREATOR, ADMIN }
}
