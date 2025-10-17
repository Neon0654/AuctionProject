package com.ThanhHAHA.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionSessionDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Double currentPrice;
    private String highestBidder;
    private String status;
}
