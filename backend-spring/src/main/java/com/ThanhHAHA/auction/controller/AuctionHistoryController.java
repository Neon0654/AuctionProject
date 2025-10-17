package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.AuctionHistoryDTO;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.service.AuctionHistoryService;
import com.ThanhHAHA.auction.service.AuctionSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
public class AuctionHistoryController {

    private final AuctionHistoryService auctionHistoryService;
    private final AuctionSessionService auctionSessionService;

    @GetMapping("/full-history/{sessionId}")
    public List<AuctionHistoryDTO> getFullAuctionHistory(@PathVariable Long sessionId) throws Exception {
        AuctionSession session = auctionSessionService.getSessionById(sessionId);
        return auctionHistoryService.getFullHistory(session);
    }
}
