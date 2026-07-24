package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.MediaAssetResponse;
import com.celebrateverse.dto.response.PageResponse;
import com.celebrateverse.dto.response.PublicPageResponse;
import com.celebrateverse.entity.BirthdayPage;
import com.celebrateverse.entity.MediaAsset;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T02:50:15+0530",
    comments = "version: 1.6.0, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class PageMapperImpl implements PageMapper {

    @Autowired
    private MediaAssetMapper mediaAssetMapper;

    @Override
    public PageResponse toResponse(BirthdayPage page) {
        if ( page == null ) {
            return null;
        }

        PageResponse pageResponse = new PageResponse();

        pageResponse.setId( page.getId() );
        pageResponse.setSlug( page.getSlug() );
        pageResponse.setRecipientName( page.getRecipientName() );
        pageResponse.setRecipientNickname( page.getRecipientNickname() );
        pageResponse.setRecipientAge( page.getRecipientAge() );
        pageResponse.setRecipientBirthday( page.getRecipientBirthday() );
        pageResponse.setFavoriteColor( page.getFavoriteColor() );
        pageResponse.setFavoriteMusicGenre( page.getFavoriteMusicGenre() );
        pageResponse.setSenderName( page.getSenderName() );
        pageResponse.setSenderRelationship( page.getSenderRelationship() );
        pageResponse.setPersonalMessage( page.getPersonalMessage() );
        pageResponse.setTheme( page.getTheme() );
        pageResponse.setCakeTheme( page.getCakeTheme() );
        pageResponse.setMode( page.getMode() );
        pageResponse.setIsPasswordProtected( page.getIsPasswordProtected() );
        pageResponse.setRevealAt( page.getRevealAt() );
        pageResponse.setIsCalmModeDefault( page.getIsCalmModeDefault() );
        pageResponse.setViewCount( page.getViewCount() );
        pageResponse.setIsPublished( page.getIsPublished() );
        pageResponse.setCreatedAt( page.getCreatedAt() );
        pageResponse.setMediaAssets( mediaAssetListToMediaAssetResponseList( page.getMediaAssets() ) );

        return pageResponse;
    }

    @Override
    public PublicPageResponse toPublicResponse(BirthdayPage page) {
        if ( page == null ) {
            return null;
        }

        PublicPageResponse publicPageResponse = new PublicPageResponse();

        publicPageResponse.setId( page.getId() );
        publicPageResponse.setSlug( page.getSlug() );
        publicPageResponse.setRecipientName( page.getRecipientName() );
        publicPageResponse.setRecipientNickname( page.getRecipientNickname() );
        publicPageResponse.setRecipientAge( page.getRecipientAge() );
        publicPageResponse.setRecipientBirthday( page.getRecipientBirthday() );
        publicPageResponse.setFavoriteColor( page.getFavoriteColor() );
        publicPageResponse.setFavoriteMusicGenre( page.getFavoriteMusicGenre() );
        publicPageResponse.setSenderName( page.getSenderName() );
        publicPageResponse.setSenderRelationship( page.getSenderRelationship() );
        publicPageResponse.setPersonalMessage( page.getPersonalMessage() );
        publicPageResponse.setTheme( page.getTheme() );
        publicPageResponse.setCakeTheme( page.getCakeTheme() );
        publicPageResponse.setMode( page.getMode() );
        publicPageResponse.setIsPasswordProtected( page.getIsPasswordProtected() );
        publicPageResponse.setRevealAt( page.getRevealAt() );
        publicPageResponse.setIsCalmModeDefault( page.getIsCalmModeDefault() );
        publicPageResponse.setViewCount( page.getViewCount() );
        publicPageResponse.setIsPublished( page.getIsPublished() );
        publicPageResponse.setCreatedAt( page.getCreatedAt() );
        publicPageResponse.setMediaAssets( mediaAssetListToMediaAssetResponseList( page.getMediaAssets() ) );

        return publicPageResponse;
    }

    protected List<MediaAssetResponse> mediaAssetListToMediaAssetResponseList(List<MediaAsset> list) {
        if ( list == null ) {
            return null;
        }

        List<MediaAssetResponse> list1 = new ArrayList<MediaAssetResponse>( list.size() );
        for ( MediaAsset mediaAsset : list ) {
            list1.add( mediaAssetMapper.toResponse( mediaAsset ) );
        }

        return list1;
    }
}
