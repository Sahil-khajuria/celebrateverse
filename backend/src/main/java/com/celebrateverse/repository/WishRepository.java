package com.celebrateverse.repository;

import com.celebrateverse.entity.Wish;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WishRepository extends JpaRepository<Wish, Long> {
    List<Wish> findByPageIdAndIsApprovedTrue(Long pageId);
    long countByPageId(Long pageId);
}
