package com.ThanhHAHA.auction.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.dto.BidMessage;
import com.ThanhHAHA.auction.service.BidService;

@Controller
public class AuctionWebSocketController {

    private final BidService bidService;

    public AuctionWebSocketController(BidService bidService) {
        this.bidService = bidService;
    }

    @MessageMapping("/bid") // client gửi tới /app/bid
    @SendTo("/topic/auction") // broadcast tới tất cả client
    public BidDTO placeBid(BidMessage message) throws Exception {
        // gọi service xử lý bid
        return bidService.placeBid(
                message.getAuctionId(),
                message.getUserId(),
                message.getAmount()
        );
    }
}
