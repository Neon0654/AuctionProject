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
@Table(name = "auction_sessions")
public class AuctionSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kết nối với Product
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Double currentPrice;

    private String highestBidder;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        ACTIVE, ENDED, CANCELLED
    }
}
