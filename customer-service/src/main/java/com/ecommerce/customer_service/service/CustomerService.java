package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.dto.ProductDTO;
import com.ecommerce.customer_service.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;


    public List<ProductDTO> getAllProducts(String category,Double price) {
        try {
         return customerRepository.getAllProducts(category,price);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            return null;
        }
    }
}
