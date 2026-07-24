package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.UserResponse;
import com.celebrateverse.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
}
