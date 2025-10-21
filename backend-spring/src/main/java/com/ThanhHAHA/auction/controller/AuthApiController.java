package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.entity.Role;
import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.RoleRepository;
import com.ThanhHAHA.auction.repository.UserRepository;
import com.ThanhHAHA.auction.service.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthApiController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthApiController(UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        return userRepository.findByUsername(username)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        String token = jwtService.generateToken(user.getUsername());
                        System.out.println("✅ User logged in: " + user.getUsername());

                        Map<String, Object> userInfo = new HashMap<>();
                        userInfo.put("id", user.getId());
                        userInfo.put("username", user.getUsername());
                        userInfo.put("role", user.getRole().getName());

                        Map<String, Object> response = new HashMap<>();
                        response.put("status", "success");
                        response.put("token", token);
                        response.put("user", userInfo);

                        return ResponseEntity.ok(response);
                    } else {
                        Map<String, Object> fail = new HashMap<>();
                        fail.put("status", "fail");
                        fail.put("message", "Invalid password");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(fail);
                    }
                })
                .orElseGet(() -> {
                    Map<String, Object> fail = new HashMap<>();
                    fail.put("status", "fail");
                    fail.put("message", "Invalid username");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(fail);
                });
    }
}
