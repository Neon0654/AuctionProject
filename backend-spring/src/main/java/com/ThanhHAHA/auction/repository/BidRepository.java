package com.ThanhHAHA.auction.repository;

import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    // Lấy tất cả bid theo phiên đấu giá, sắp xếp tăng dần theo timestamp
    List<Bid> findByAuctionSessionOrderByTimestampAsc(AuctionSession session);

    // Lấy tất cả bid theo phiên đấu giá, sắp xếp giảm dần theo timestamp
    List<Bid> findByAuctionSessionIdOrderByTimestampDesc(Long sessionId);

    // Lấy tất cả bid theo phiên đấu giá, sắp xếp tăng dần theo timestamp (theo sessionId)
    List<Bid> findByAuctionSessionIdOrderByTimestampAsc(Long sessionId);
}

