package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.dto.AuctionHistoryDTO;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.History;
import com.ThanhHAHA.auction.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionHistoryService {

    private final BidRepository bidRepository;
    private final HistoryService historyService;

    public List<AuctionHistoryDTO> getFullHistory(AuctionSession session) {
        List<AuctionHistoryDTO> historyList = new ArrayList<>();
        
        // 1️⃣ Lấy bid
        List<Bid> bids = bidRepository.findByAuctionSessionOrderByTimestampAsc(session);
        for (Bid b : bids) {
            AuctionHistoryDTO dto = new AuctionHistoryDTO();
            dto.setActionType("BID_PLACED");
            dto.setUsername(b.getUser().getUsername());
            dto.setAmount(b.getAmount());
            dto.setTimestamp(b.getTimestamp());
            historyList.add(dto);
        }

        // 2️⃣ Lấy các hành động khác
        List<History> otherActions = historyService.getHistoryBySession(session);
        for (History h : otherActions) {
            AuctionHistoryDTO dto = new AuctionHistoryDTO();
            dto.setActionType(h.getActionType());
            dto.setUsername(h.getUser().getUsername());
            dto.setTimestamp(h.getTimestamp());
            dto.setAmount(null); // không có giá bid
            historyList.add(dto);
        }

        // 3️⃣ Sắp xếp theo thời gian
        historyList.sort((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()));

        return historyList;
    }
}
