package com.ThanhHAHA.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidMessage {
    private Long auctionId; // ID phiên đấu giá
    private Long userId;    // ID người bid
    private Double amount;  // số tiền bid
}
