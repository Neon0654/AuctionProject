package com.ThanhHAHA.auction.repository;

import com.ThanhHAHA.auction.entity.History;
import com.ThanhHAHA.auction.entity.AuctionSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByAuctionSessionOrderByTimestampAsc(AuctionSession session);
}
