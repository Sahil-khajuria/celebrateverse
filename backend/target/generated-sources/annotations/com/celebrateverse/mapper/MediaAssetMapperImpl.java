package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.MediaAssetResponse;
import com.celebrateverse.entity.MediaAsset;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T02:50:15+0530",
    comments = "version: 1.6.0, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class MediaAssetMapperImpl implements MediaAssetMapper {

    @Override
    public MediaAssetResponse toResponse(MediaAsset mediaAsset) {
        if ( mediaAsset == null ) {
            return null;
        }

        MediaAssetResponse mediaAssetResponse = new MediaAssetResponse();

        mediaAssetResponse.setId( mediaAsset.getId() );
        if ( mediaAsset.getType() != null ) {
            mediaAssetResponse.setType( mediaAsset.getType().name() );
        }
        mediaAssetResponse.setUrl( mediaAsset.getUrl() );
        mediaAssetResponse.setSortOrder( mediaAsset.getSortOrder() );

        return mediaAssetResponse;
    }
}
