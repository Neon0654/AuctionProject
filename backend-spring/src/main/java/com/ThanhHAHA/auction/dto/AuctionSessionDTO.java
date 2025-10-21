package com.ThanhHAHA.auction.dto;

import java.time.LocalDateTime;

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
    private Double startingPrice; // giá khởi điểm từ product.price
    private Double currentPrice;
    private String highestBidder;
    private String status;
    private LocalDateTime endTime; // hoặc String ISO
}

