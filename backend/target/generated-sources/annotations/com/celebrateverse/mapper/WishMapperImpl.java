package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.WishResponse;
import com.celebrateverse.entity.Wish;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T02:50:15+0530",
    comments = "version: 1.6.0, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class WishMapperImpl implements WishMapper {

    @Override
    public WishResponse toResponse(Wish wish) {
        if ( wish == null ) {
            return null;
        }

        WishResponse wishResponse = new WishResponse();

        wishResponse.setId( wish.getId() );
        wishResponse.setAuthorName( wish.getAuthorName() );
        wishResponse.setMessage( wish.getMessage() );
        wishResponse.setPhotoUrl( wish.getPhotoUrl() );
        wishResponse.setReactionEmoji( wish.getReactionEmoji() );
        wishResponse.setCreatedAt( wish.getCreatedAt() );

        return wishResponse;
    }
}
