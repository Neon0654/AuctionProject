package com.ThanhHAHA.auction.dto;

import java.time.LocalDateTime;
import lombok.Data;
import com.ThanhHAHA.auction.entity.Bid;

@Data
public class BidDTO {
    private Long id;
    private Long auctionId;
    private Long userId;
    private String username;
    private Double amount;
    private LocalDateTime bidTime;

    // Constructor dùng cho map từ Bid entity
    public BidDTO(Bid bid) {
        this.id = bid.getId();
        this.auctionId = bid.getAuctionSession().getId();
        this.userId = bid.getUser().getId();
        this.username = bid.getUser().getUsername();
        this.amount = bid.getAmount();
        this.bidTime = bid.getTimestamp();
    }

    // ✅ Constructor thủ công cho các trường hợp tạo từ service
    public BidDTO(Long id, Long auctionId, Long userId, String username, Double amount, LocalDateTime bidTime) {
        this.id = id;
        this.auctionId = auctionId;
        this.userId = userId;
        this.username = username;
        this.amount = amount;
        this.bidTime = bidTime;
    }
}
