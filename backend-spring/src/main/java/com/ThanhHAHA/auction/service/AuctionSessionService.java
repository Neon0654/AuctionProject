package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.dto.AuctionSessionDTO;
import com.ThanhHAHA.auction.dto.BidDTO;
import com.ThanhHAHA.auction.entity.AuctionSession;
import com.ThanhHAHA.auction.entity.Bid;
import com.ThanhHAHA.auction.entity.Product;
import com.ThanhHAHA.auction.repository.AuctionSessionRepository;
import com.ThanhHAHA.auction.repository.BidRepository;
import com.ThanhHAHA.auction.repository.ProductRepository;
import com.ThanhHAHA.auction.repository.UserRepository;
import com.ThanhHAHA.auction.service.HistoryService;
import com.ThanhHAHA.auction.repository.UserRepository;
import com.ThanhHAHA.auction.entity.User;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuctionSessionService {

    private final AuctionSessionRepository sessionRepo;
    private final ProductRepository productRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final BidRepository bidRepo;
    private final HistoryService historyService;
    private final UserRepository userRepository;

    public AuctionSessionService(
            AuctionSessionRepository sessionRepo,
            ProductRepository productRepo,
            SimpMessagingTemplate messagingTemplate,
            BidRepository bidRepo,
            HistoryService historyService,
            UserRepository userRepository) {
        this.sessionRepo = sessionRepo;
        this.productRepo = productRepo;
        this.messagingTemplate = messagingTemplate;
        this.bidRepo = bidRepo;
        this.historyService = historyService;
        this.userRepository = userRepository;
    }

    // Tạo session mới
    public AuctionSessionDTO createSession(Long productId, LocalDateTime start, LocalDateTime end) throws Exception {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new Exception("Product not found"));

        AuctionSession session = new AuctionSession();
        session.setProduct(product);
        session.setStartTime(start);
        session.setEndTime(end);
        session.setCurrentPrice(product.getPrice());
        session.setStatus(AuctionSession.Status.ACTIVE);

        AuctionSession saved = sessionRepo.save(session);
        return mapToDTO(saved);
    }

    // Đặt giá thầu
    public AuctionSessionDTO placeBid(Long sessionId, String bidder, Double bidAmount) throws Exception {
        AuctionSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new Exception("Session not found"));

        if (session.getStatus() != AuctionSession.Status.ACTIVE)
            throw new Exception("Session not active");

        if (bidAmount <= session.getCurrentPrice())
            throw new Exception("Bid must be higher than current price");

        User user = userRepository.findByUsername(bidder)
                .orElseThrow(() -> new Exception("User not found for bidder: " + bidder));

        session.setCurrentPrice(bidAmount);
        session.setHighestBidder(bidder);
        AuctionSession saved = sessionRepo.save(session);

        Bid bid = new Bid();
        bid.setAuctionSession(session);
        bid.setUser(user);
        bid.setAmount(bidAmount);
        bid.setTimestamp(LocalDateTime.now());
        bidRepo.save(bid);

        historyService.addHistory(session, "BID_PLACED", user, bidAmount);

        // trigger WebSocket
        BidDTO bidDto = new BidDTO(
                bid.getId(),
                session.getId(),
                user.getId(),
                user.getUsername(),
                bid.getAmount(),
                bid.getTimestamp());

        System.out.println("📢 Broadcasting to /topic/auction/" + sessionId);
        System.out.println("Payload: " + bidDto);
        
        messagingTemplate.convertAndSend(
                "/topic/auction/" + sessionId,
                bidDto);

        return mapToDTO(saved);
    }

    // Kết thúc phiên đấu giá
    public AuctionSessionDTO endSession(Long sessionId) throws Exception {
        AuctionSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new Exception("Session not found"));

        session.setStatus(AuctionSession.Status.ENDED);
        AuctionSession saved = sessionRepo.save(session);
        return mapToDTO(saved);
    }

    // Hàm map entity → DTO
    private AuctionSessionDTO mapToDTO(AuctionSession session) {
        return new AuctionSessionDTO(
                session.getId(),
                session.getProduct().getId(),
                session.getProduct().getName(),
                session.getProduct().getPrice(), // ← đây là giá khởi điểm
                session.getCurrentPrice(),
                session.getHighestBidder(),
                session.getStatus().name(),
                session.getEndTime());
    }

    public AuctionSession getSessionById(Long sessionId) throws Exception {
        Optional<AuctionSession> session = sessionRepo.findById(sessionId);
        if (session.isPresent()) {
            return session.get();
        } else {
            throw new Exception("AuctionSession not found with id: " + sessionId);
        }
    }

    public Optional<AuctionSessionDTO> getActiveSessionByProductId(Long productId) {
        return sessionRepo.findByProductIdAndStatus(productId, AuctionSession.Status.ACTIVE)
                .map(this::mapToDTO);
    }

    public List<BidDTO> getBidsBySessionId(Long sessionId) throws Exception {
        return bidRepo.findByAuctionSessionIdOrderByTimestampDesc(sessionId)
                .stream()
                .map(bid -> new BidDTO(
                        bid.getId(),
                        bid.getAuctionSession().getId(),
                        bid.getUser().getId(),
                        bid.getUser().getUsername(),
                        bid.getAmount(),
                        bid.getTimestamp()))
                .collect(Collectors.toList());
    }
}
