package com.ecommerce.user_service.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String validateUser(String username, String password) {
        String query = "SELECT validateUser(?,?) FROM dual";
        return jdbcTemplate.queryForObject(query,String.class, username, password);
    }
}
