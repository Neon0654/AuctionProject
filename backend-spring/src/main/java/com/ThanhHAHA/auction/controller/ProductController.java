package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.AuctionSessionDTO;
import com.ThanhHAHA.auction.dto.ProductDTO;
import com.ThanhHAHA.auction.entity.Product;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.ProductRepository;
import com.ThanhHAHA.auction.repository.UserRepository;
import com.ThanhHAHA.auction.service.AuctionSessionService;
import com.ThanhHAHA.auction.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private AuctionSessionService auctionSessionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProductsDTO();
    }

    @GetMapping("/{productId}/active-session")
    public ResponseEntity<AuctionSessionDTO> getActiveSession(@PathVariable Long productId) {
        return auctionSessionService.getActiveSessionByProductId(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(productService::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // owner từ product.owner
        return productService.createProduct(product, product.getOwner());
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
            @RequestBody Product productDetails,
            Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return productService.updateProduct(id, productDetails, currentUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        productService.deleteProduct(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
