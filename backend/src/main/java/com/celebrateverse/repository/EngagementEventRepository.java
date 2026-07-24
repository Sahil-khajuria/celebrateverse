package com.celebrateverse.repository;

import com.celebrateverse.entity.EngagementEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EngagementEventRepository extends JpaRepository<EngagementEvent, Long> {
    long countByPageIdAndEventType(Long pageId, String eventType);
    long countByPageId(Long pageId);
}
