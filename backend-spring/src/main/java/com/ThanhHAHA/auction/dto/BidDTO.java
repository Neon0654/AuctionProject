package com.ThanhHAHA.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidDTO {
    private Long id;
    private Long auctionSessionId;
    private Long userId;
    private String username;
    private Double amount;
    private LocalDateTime timestamp;
}
