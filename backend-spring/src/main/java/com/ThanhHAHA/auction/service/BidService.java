package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.AuctionSessionRepository;
import com.ThanhHAHA.auction.repository.BidRepository;
import com.ThanhHAHA.auction.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BidService {

    private final BidRepository bidRepo;
    private final AuctionSessionRepository sessionRepo;
    private final UserRepository userRepo;

    public BidService(BidRepository bidRepo, AuctionSessionRepository sessionRepo, UserRepository userRepo) {
        this.bidRepo = bidRepo;
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
    }

    public BidDTO placeBid(Long sessionId, Long userId, Double amount) throws Exception {
        AuctionSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new Exception("Auction session not found"));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        if (session.getStatus() != AuctionSession.Status.ACTIVE)
            throw new Exception("Session not active");

        if (amount <= session.getCurrentPrice())
            throw new Exception("Bid must be higher than current price");

        // Lưu bid
        Bid bid = new Bid();
        bid.setAuctionSession(session);
        bid.setUser(user);
        bid.setAmount(amount);
        bid.setTimestamp(LocalDateTime.now());

        Bid savedBid = bidRepo.save(bid);

        // Cập nhật phiên đấu giá
        session.setCurrentPrice(amount);
        session.setHighestBidder(user.getUsername());
        sessionRepo.save(session);

        return mapToDTO(savedBid);
    }

    private BidDTO mapToDTO(Bid bid) {
        return new BidDTO(
                bid.getId(),
                bid.getAuctionSession().getId(),
                bid.getUser().getId(),
                bid.getUser().getUsername(),
                bid.getAmount(),
                bid.getTimestamp());
    }

    public List<BidDTO> getBidsBySession(Long sessionId) throws Exception {
        AuctionSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new Exception("Auction session not found"));

        List<Bid> bids = bidRepo.findByAuctionSessionOrderByTimestampAsc(session);

        return bids.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
