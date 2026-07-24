package com.celebrateverse.dto.request;

import lombok.Data;

@Data
public class GenerateMessageRequest {
    private String recipientName;
    private String relationship;
    private String tone = "warm";
}
