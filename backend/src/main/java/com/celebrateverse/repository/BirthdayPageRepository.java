package com.celebrateverse.repository;

import com.celebrateverse.entity.BirthdayPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BirthdayPageRepository extends JpaRepository<BirthdayPage, Long> {
    Optional<BirthdayPage> findBySlug(String slug);
    List<BirthdayPage> findByOwnerUserId(Long ownerUserId);
    
    @Modifying
    @Query("UPDATE BirthdayPage p SET p.viewCount = p.viewCount + 1 WHERE p.id = :pageId")
    void incrementViewCount(@Param("pageId") Long pageId);
}
