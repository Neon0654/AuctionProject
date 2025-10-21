package com.ThanhHAHA.auction.security;

import com.ThanhHAHA.auction.entity.User;
import com.ThanhHAHA.auction.repository.UserRepository;
import com.ThanhHAHA.auction.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtService.validateToken(token);

            // DEBUG: xem username lấy từ token
            System.out.println("Username from token: " + username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Lấy user từ DB
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null) {
                    // Set Authentication với role của user
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            user,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority(
                                    user.getRole() != null ? user.getRole().getName() : "USER"
                            ))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // Bắt buộc gọi filter chain để request tiếp tục
        filterChain.doFilter(request, response);
    }
}
