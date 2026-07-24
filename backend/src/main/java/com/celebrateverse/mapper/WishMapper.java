package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.WishResponse;
import com.celebrateverse.entity.Wish;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WishMapper {
    WishResponse toResponse(Wish wish);
}
