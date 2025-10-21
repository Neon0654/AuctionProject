package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.dto.AuctionHistoryDTO;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.History;
import com.ThanhHAHA.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionHistoryService {

    private final BidRepository bidRepository;
    private final HistoryService historyService;

    public List<AuctionHistoryDTO> getFullHistory(AuctionSession session) {
        List<AuctionHistoryDTO> historyList = new ArrayList<>();

        // 1️⃣ Thêm các lượt bid
        List<Bid> bids = bidRepository.findByAuctionSessionOrderByTimestampAsc(session);
        for (Bid b : bids) {
            AuctionHistoryDTO dto = new AuctionHistoryDTO();
            dto.setActionType("BID_PLACED");
            dto.setUsername(
                (b.getUser() != null && b.getUser().getUsername() != null)
                    ? b.getUser().getUsername()
                    : "Người dùng ẩn danh"
            );
            dto.setAmount(b.getAmount());
            dto.setTimestamp(b.getTimestamp());
            historyList.add(dto);
        }

        // 2️⃣ Thêm các hành động khác trong bảng History
        List<History> otherActions = historyService.getHistoryBySession(session);
        for (History h : otherActions) {
            AuctionHistoryDTO dto = new AuctionHistoryDTO();
            dto.setActionType(h.getActionType());
            dto.setUsername(
                (h.getUser() != null && h.getUser().getUsername() != null)
                    ? h.getUser().getUsername()
                    : "Hệ thống"
            );
            dto.setAmount(null); // các hành động khác không có giá bid
            dto.setTimestamp(h.getTimestamp());
            historyList.add(dto);
        }

        // 3️⃣ Sắp xếp theo thời gian
        historyList.sort(Comparator.comparing(AuctionHistoryDTO::getTimestamp));

        return historyList;
    }
}
