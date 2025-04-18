package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.dto.ProductDTO;
import com.ecommerce.customer_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository customerRepository;


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
