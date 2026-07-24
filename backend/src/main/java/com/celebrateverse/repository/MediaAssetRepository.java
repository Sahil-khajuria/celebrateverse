package com.celebrateverse.repository;

import com.celebrateverse.entity.MediaAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MediaAssetRepository extends JpaRepository<MediaAsset, Long> {
    List<MediaAsset> findByPageIdAndType(Long pageId, MediaAsset.MediaType type);
    List<MediaAsset> findByPageIdOrderBySortOrder(Long pageId);
}
