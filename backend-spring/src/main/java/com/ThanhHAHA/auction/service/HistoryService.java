package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.entity.History;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    // Lấy tất cả history theo phiên đấu giá
    public List<History> getHistoryBySession(AuctionSession session) {
        return historyRepository.findByAuctionSessionOrderByTimestampAsc(session);
    }

    // Thêm history mới
    // Trong HistoryService
    public History addHistory(AuctionSession session, String actionType, User user, Double bidAmount) {
        History h = new History();
        h.setAuctionSession(session);
        h.setActionType(actionType);
        h.setUser(user); // lưu object User
        h.setBidAmount(bidAmount);
        h.setTimestamp(LocalDateTime.now());
        return historyRepository.save(h);
    }

}
