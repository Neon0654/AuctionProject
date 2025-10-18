package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.dto.ProductDTO;
import com.ThanhHAHA.auction.entity.Product;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts()
                .stream()
                .map(productService::toDTO)
                .collect(Collectors.toList());
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(productService::toDTO) // <-- map sang DTO
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create
    @PostMapping
    public Product createProduct(@RequestBody Product product,
            @AuthenticationPrincipal User currentUser) {
        return productService.createProduct(product, currentUser);
    }

    // PUT update
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
            @RequestBody Product productDetails,
            @AuthenticationPrincipal User currentUser) {
        return productService.updateProduct(id, productDetails, currentUser);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        productService.deleteProduct(id, currentUser);
        return ResponseEntity.noContent().build();
    }

}
