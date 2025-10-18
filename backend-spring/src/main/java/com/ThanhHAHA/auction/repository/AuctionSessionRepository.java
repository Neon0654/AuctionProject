package com.ThanhHAHA.auction.repository;

import com.ThanhHAHA.auction.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AuctionSessionRepository extends JpaRepository<AuctionSession, Long> {
    List<AuctionSession> findByStatus(AuctionSession.Status status);

    Optional<AuctionSession> findByProductIdAndStatus(Long productId, AuctionSession.Status status);

}

