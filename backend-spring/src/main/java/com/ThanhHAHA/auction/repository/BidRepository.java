package com.ThanhHAHA.auction.repository;

import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByAuctionSessionOrderByTimestampAsc(AuctionSession session);
}

