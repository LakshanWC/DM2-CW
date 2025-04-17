package com.example.admin_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.admin_service.service.adminService;

@RestController
@RequestMapping("/api/admin")
public class adminController {

    @Autowired
    private adminService adminService;

    @DeleteMapping("/remove-user/{username}")
    public String removeUser(@PathVariable String username) {
        return adminService.removeUser(username);
    }
}