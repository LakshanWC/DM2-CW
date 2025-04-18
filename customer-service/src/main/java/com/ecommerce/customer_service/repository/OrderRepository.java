package com.ecommerce.customer_service.repository;

import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.StringReader;
import java.sql.CallableStatement;
import java.sql.Types;

@Repository
public class OrderRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String saveOrder(String orderDate, String paymentType, String userId, String productJson) {
        System.out.println("Product JSON: " + productJson);
        return jdbcTemplate.execute(
                (CallableStatementCreator) connection -> {
                    CallableStatement cs = connection.prepareCall("{ ? = call SYSTEM.saveOrder(?, ?, ?, ?) }");
                    cs.registerOutParameter(1, Types.VARCHAR); // return value
                    cs.setDate(2, java.sql.Date.valueOf(orderDate));
                    cs.setString(3, paymentType);
                    cs.setString(4, userId);
                    cs.setCharacterStream(5, new StringReader(productJson));
                    return cs;
                },
                (CallableStatementCallback<String>) cs -> {
                    cs.execute();
                    return cs.getString(1); // return value from the function
                }
        );
    }
}