package com.ecommerce.customer_service.controller;
import com.ecommerce.customer_service.dto.ProductDTO;
import com.ecommerce.customer_service.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductService customerService;

    @GetMapping
    public List<ProductDTO> getAllProducts(
            @RequestParam (required = false) String category,
            @RequestParam (required = false) Double price) {
        return customerService.getAllProducts(category,price);
    }

    @PostMapping
    public String addProduct(@RequestBody ProductDTO productDTO) {
        return customerService.addProduct(productDTO);
    }

}
