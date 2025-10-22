package com.ThanhHAHA.auction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bids")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với AuctionSession
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_session_id")
    private AuctionSession auctionSession;

    // Liên kết với User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Double amount;

    private LocalDateTime timestamp;

    public LocalDateTime getBidTime() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getBidTime'");
    }
}

