package com.ecommerce.user_service.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.CallableStatement;
import java.sql.Types;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String validateUser(String username, String password, String role) {
        String query = "SELECT validateUser(?,?,?) FROM dual";
        return jdbcTemplate.queryForObject(query, String.class, username, password, role);
    }

    public String createUser(String name, String email, String address,
                             String username, String password,
                             String phoneNo, String role) {

        String sql = "{ call createUser(?, ?, ?, ?, ?, ?, ?, ?) }";

        return jdbcTemplate.execute(
                (CallableStatementCreator) connection -> {
                    CallableStatement cs = connection.prepareCall(sql);
                    cs.setString(1, name);
                    cs.setString(2, email);
                    cs.setString(3, address);
                    cs.setString(4, username);
                    cs.setString(5, password);
                    cs.setString(6, phoneNo);
                    cs.setInt(7, Integer.parseInt(role)); // 1 = customer, 2 = supplier
                    cs.registerOutParameter(8, Types.VARCHAR); // output parameter
                    return cs;
                },
                (CallableStatementCallback<String>) cs -> {
                    cs.execute();
                    return cs.getString(8); // get the OUT message
                }
        );
    }

}
