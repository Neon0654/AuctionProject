package com.ThanhHAHA.auction.repository;

import com.ThanhHAHA.auction.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {
    List<AuctionSession> findByStatus(AuctionSession.Status status);
}

