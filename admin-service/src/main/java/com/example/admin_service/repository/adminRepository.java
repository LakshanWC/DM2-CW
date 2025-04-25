package com.example.admin_service.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;


@Repository
public class adminRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String removeUser(String username) {
        return jdbcTemplate.execute((Connection connection) -> {
            try (CallableStatement cs = connection.prepareCall(
                    "{ ? = call remove_user_by_username(?) }")) {
                cs.registerOutParameter(1, Types.VARCHAR);
                cs.setString(2, username);
                cs.execute();
                return cs.getString(1);
            } catch (Exception e) {
                throw new RuntimeException("Error calling remove_user_by_username: " + e.getMessage(), e);
            }
        });
    }
}