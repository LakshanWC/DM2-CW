package com.ecommerce.customer_service.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerRepository{

    @Autowired
    private JdbcTemplate jdbcTemplate;


}
