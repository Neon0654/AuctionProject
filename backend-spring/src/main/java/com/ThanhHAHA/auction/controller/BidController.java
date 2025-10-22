package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bid")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;
    private final SimpMessagingTemplate messagingTemplate;

    // Lấy danh sách bid của 1 phiên
    @GetMapping("/{id}/bids")
    public List<BidDTO> getBids(@PathVariable Long id) throws Exception {
        return bidService.getBidsBySession(id);
    }

    // Khi đặt giá mới
    @PostMapping("/place")
    public BidDTO placeBid(
            @RequestParam Long sessionId,
            @RequestParam Long userId,
            @RequestParam Double amount
    ) throws Exception {
        BidDTO bid = bidService.placeBid(sessionId, userId, amount);

        // 🔥 Gửi broadcast đến tất cả client đang subscribe topic /topic/auction/{sessionId}
        messagingTemplate.convertAndSend("/topic/auction/" + sessionId, bid);

        return bid;
    }

    // Lấy lịch sử bid
    @GetMapping("/history/{sessionId}")
    public List<BidDTO> getBidHistory(@PathVariable Long sessionId) throws Exception {
        return bidService.getBidsBySession(sessionId);
    }
}
