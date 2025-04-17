package com.example.admin_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.admin_service.service.adminService;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class adminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        String sql = "SELECT userid, name, username, email, address, status FROM Users";
        return jdbcTemplate.queryForList(sql);
    }

    @DeleteMapping("/remove-user/{username}")
    public String removeUser(@PathVariable String username) {
        String sql = "{ ? = call remove_user_by_username(?) }";
        return jdbcTemplate.execute((Connection connection) -> {
            try (CallableStatement cs = connection.prepareCall(sql)) {
                cs.registerOutParameter(1, Types.VARCHAR);
                cs.setString(2, username);
                cs.execute();
                return cs.getString(1);
            }
        });
    }
}