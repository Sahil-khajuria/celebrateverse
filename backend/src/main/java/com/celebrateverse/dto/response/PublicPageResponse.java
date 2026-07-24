package com.celebrateverse.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PublicPageResponse extends PageResponse {
    // Excludes password hash and owner info natively as they aren't in PageResponse either
}
