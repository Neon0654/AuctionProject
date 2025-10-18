package com.ThanhHAHA.auction.service;

import com.ThanhHAHA.auction.dto.AuctionSessionDTO;
import com.ThanhHAHA.auction.dto.ProductDTO;
import com.ThanhHAHA.auction.entity.Product;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AuctionSessionService auctionSessionService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product, User owner) {
        product.setOwner(owner);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getOwner().equals(currentUser)) {
            throw new RuntimeException("You are not allowed to update this product");
        }

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id, User currentUser) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getOwner().equals(currentUser)) {
            throw new RuntimeException("You are not allowed to delete this product");
        }

        productRepository.delete(product);
    }

    public ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOwnerUsername(product.getOwner().getUsername());

        // Lấy session ACTIVE của product
        AuctionSessionDTO activeSession = auctionSessionService.getActiveSessionByProductId(product.getId())
                .orElse(null);
        dto.setActiveSession(activeSession);

        return dto;
    }

}
