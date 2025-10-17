package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.entity.History;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public History addHistory(AuctionSession session, String actionType, Long userId) {
        History h = new History();
        h.setAuctionSession(session);
        h.setActionType(actionType);

        // Chỉ demo: cần userService để lấy User object
        // User user = userService.getUserById(userId);
        // h.setUser(user);

        h.setTimestamp(java.time.LocalDateTime.now());
        return historyRepository.save(h);
    }
}
