package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.AuctionSessionDTO;
import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.service.AuctionSessionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auction")
public class AuctionSessionController {

    private final AuctionSessionService service;

    public AuctionSessionController(AuctionSessionService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public AuctionSessionDTO create(@RequestParam Long productId,
            @RequestParam String startTime,
            @RequestParam String endTime) throws Exception {
        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        return service.createSession(productId, start, end);
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<List<BidDTO>> getBids(@PathVariable Long id) {
        try {
            List<BidDTO> bids = service.getBidsBySessionId(id);
            return ResponseEntity.ok(bids);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/bid")
    public AuctionSessionDTO bid(@PathVariable Long id,
            @RequestParam String bidder,
            @RequestParam Double amount) throws Exception {
        return service.placeBid(id, bidder, amount);
    }

    @PostMapping("/{id}/end")
    public AuctionSessionDTO end(@PathVariable Long id) throws Exception {
        return service.endSession(id);
    }
}
