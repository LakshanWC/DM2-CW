package com.ecommerce.customer_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequestMapping("/customers")
@CrossOrigin(origins = "http://localhost:3000")
public class CustomerService {


}
