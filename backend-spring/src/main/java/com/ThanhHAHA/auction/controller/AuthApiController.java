package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.entity.Role;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.RoleRepository;
import com.ThanhHAHA.auction.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthApiController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthApiController(UserRepository userRepository,
                             RoleRepository roleRepository,
                             PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        if (userRepository.findByUsername(body.get("username")).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "fail", "message", "Username already exists"));
        }

        User user = new User();
        user.setUsername(body.get("username"));
        user.setPassword(passwordEncoder.encode(body.get("password")));

        // Gán role mặc định
        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRole(defaultRole);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("status", "success", "username", user.getUsername()));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> body) {
        return userRepository.findByUsername(body.get("username"))
                .map(user -> {
                    if (passwordEncoder.matches(body.get("password"), user.getPassword())) {
                        return ResponseEntity.ok(Map.of("status", "success"));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("status", "fail", "message", "Invalid password"));
                    }
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", "fail", "message", "Invalid username")));
    }
}
