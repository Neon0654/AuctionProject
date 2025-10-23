package com.ThanhHAHA.auction.controller;

import com.ThanhHAHA.auction.entity.Role;
import com.ThanhHAHA.auction.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void initRoles() {
        // Kiểm tra nếu chưa có role USER thì thêm mới
        if (roleRepository.findByName("USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
            System.out.println("✅ Created default role: USER");
        }

        // Kiểm tra nếu chưa có role ADMIN thì thêm mới
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
            System.out.println("✅ Created default role: ADMIN");
        }
    }
}
