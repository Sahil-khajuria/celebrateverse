package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.MediaAssetResponse;
import com.celebrateverse.entity.MediaAsset;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MediaAssetMapper {
    MediaAssetResponse toResponse(MediaAsset mediaAsset);
}
