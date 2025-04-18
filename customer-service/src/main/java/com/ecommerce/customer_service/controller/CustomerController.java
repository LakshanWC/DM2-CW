package com.ecommerce.customer_service.controller;
import com.ecommerce.customer_service.dto.ProductDTO;
import com.ecommerce.customer_service.repository.CustomerRepository;
import com.ecommerce.customer_service.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<ProductDTO> getAllProducts(
            @RequestParam (required = false) String category,
            @RequestParam (required = false) Double price) {
        return customerService.getAllProducts(category,price);
    }


}
