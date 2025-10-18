package com.ThanhHAHA.auction.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.dto.BidMessage;
import com.ThanhHAHA.auction.service.BidService;

@Controller
public class AuctionWebSocketController {

    private final BidService bidService;
    private final SimpMessagingTemplate messagingTemplate;

    public AuctionWebSocketController(BidService bidService, SimpMessagingTemplate messagingTemplate) {
        this.bidService = bidService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/bid") // client gửi tới /app/bid
    public void placeBid(BidMessage message) throws Exception {
        BidDTO bid = bidService.placeBid(
                message.getAuctionId(),
                message.getUserId(),
                message.getAmount()
        );

        // broadcast chỉ tới session này
        messagingTemplate.convertAndSend(
                "/topic/auction/" + message.getAuctionId(),
                bid
        );
    }
}

