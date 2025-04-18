package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.dto.OrderRequest;
import com.ecommerce.customer_service.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public String createOrder(OrderRequest request) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        String productJson = mapper.writeValueAsString(request.getProducts());

        return orderRepository.saveOrder(
                request.getOrderDate(),
                request.getPaymentType(),
                request.getUserId(),
                productJson
        );
    }
}
