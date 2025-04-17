package com.example.admin_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.admin_service.repository.adminRepository;

@Service
public class adminService {

    @Autowired
    private adminRepository adminRepository;

    public String removeUser(String username) {
        return adminRepository.removeUser(username);
    }
}