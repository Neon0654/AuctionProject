package com.ThanhHAHA.auction.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String ownerUsername;
    private AuctionSessionDTO activeSession;
}


