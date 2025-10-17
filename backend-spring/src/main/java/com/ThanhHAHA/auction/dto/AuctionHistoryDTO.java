package com.ThanhHAHA.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionHistoryDTO {
    private String actionType;    // "BID_PLACED", "SESSION_STARTED", ...
    private String username;      // ai thực hiện hành động
    private Double amount;        // chỉ có nếu action là BID_PLACED
    private LocalDateTime timestamp;
}
