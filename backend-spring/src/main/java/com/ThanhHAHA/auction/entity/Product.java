package com.ThanhHAHA.auction.entity;

import java.util.ArrayList;
import java.util.List;

import com.ThanhHAHA.auction.dto.AuctionSessionDTO;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private double price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id") // khóa ngoại trỏ tới User
    private User owner;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<AuctionSession> auctionSessions = new ArrayList<>();
}

