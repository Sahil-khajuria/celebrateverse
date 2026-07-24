package com.celebrateverse.service;

import com.celebrateverse.dto.response.AnalyticsResponse;
import com.celebrateverse.entity.BirthdayPage;
import com.celebrateverse.entity.EngagementEvent;
import com.celebrateverse.exception.ResourceNotFoundException;
import com.celebrateverse.repository.BirthdayPageRepository;
import com.celebrateverse.repository.EngagementEventRepository;
import com.celebrateverse.repository.WishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final EngagementEventRepository engagementEventRepository;
    private final BirthdayPageRepository pageRepository;
    private final WishRepository wishRepository;

    public void logEvent(String slug, String eventType) {
        BirthdayPage page = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        EngagementEvent event = EngagementEvent.builder()
                .page(page)
                .eventType(eventType)
                .build();
        engagementEventRepository.save(event);
    }

    public AnalyticsResponse getAnalytics(Long pageId) {
        BirthdayPage page = pageRepository.findById(pageId)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found"));

        long wishCount = wishRepository.countByPageId(pageId);
        long candleBlown = engagementEventRepository.countByPageIdAndEventType(pageId, "CANDLE_BLOWN");
        long replayCount = engagementEventRepository.countByPageIdAndEventType(pageId, "REPLAY");
        long heartCount = engagementEventRepository.countByPageIdAndEventType(pageId, "HEART");
        long totalEngagements = engagementEventRepository.countByPageId(pageId);

        return AnalyticsResponse.builder()
                .viewCount(page.getViewCount())
                .wishCount(wishCount)
                .candleBlownCount(candleBlown)
                .replayCount(replayCount)
                .heartCount(heartCount)
                .totalEngagements(totalEngagements)
                .build();
    }
}
