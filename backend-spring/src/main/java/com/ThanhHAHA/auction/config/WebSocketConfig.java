package com.ThanhHAHA.auction.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // ✅ endpoint frontend sẽ kết nối tới: /ws/auction
        registry.addEndpoint("/ws/auction")
                .setAllowedOriginPatterns("http://localhost:*") // cho phép React dev server
                .withSockJS(); // bật SockJS fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // ✅ /topic dành cho broadcast ra client
        registry.enableSimpleBroker("/topic");
        // ✅ /app cho các message client gửi lên server
        registry.setApplicationDestinationPrefixes("/app");
    }
}
