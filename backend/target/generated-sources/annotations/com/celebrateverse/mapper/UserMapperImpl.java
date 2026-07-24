package com.celebrateverse.mapper;

import com.celebrateverse.dto.response.UserResponse;
import com.celebrateverse.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-25T02:50:15+0530",
    comments = "version: 1.6.0, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserResponse toResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setId( user.getId() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setDisplayName( user.getDisplayName() );
        if ( user.getRole() != null ) {
            userResponse.setRole( user.getRole().name() );
        }

        return userResponse;
    }
}
