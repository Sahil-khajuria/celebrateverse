package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.PageResponse;
import com.celebrateverse.dto.response.PublicPageResponse;
import com.celebrateverse.entity.BirthdayPage;
import org.mapstruct.Mapper;

import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {MediaAssetMapper.class})
public interface PageMapper {
    @Mapping(target = "shareUrl", ignore = true)
    @Mapping(target = "qrCodeUrl", ignore = true)
    PageResponse toResponse(BirthdayPage page);

    @Mapping(target = "shareUrl", ignore = true)
    @Mapping(target = "qrCodeUrl", ignore = true)
    PublicPageResponse toPublicResponse(BirthdayPage page);
}
