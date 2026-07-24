package com.celebrateverse.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ReorderMediaRequest {
    private List<Long> assetIds;
}
