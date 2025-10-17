package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.service.BidService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bid")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping("/place")
    public BidDTO placeBid(@RequestParam Long sessionId,
            @RequestParam Long userId,
            @RequestParam Double amount) throws Exception {
        return bidService.placeBid(sessionId, userId, amount);
    }

    @GetMapping("/history/{sessionId}")
    public List<BidDTO> getBidHistory(@PathVariable Long sessionId) throws Exception {
        return bidService.getBidsBySession(sessionId);
    }

}