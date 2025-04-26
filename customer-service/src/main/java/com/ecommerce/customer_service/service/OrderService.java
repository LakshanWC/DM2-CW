package com.ecommerce.customer_service.service;

import com.ecommerce.customer_service.dto.OrderDTO;
import com.ecommerce.customer_service.dto.OrderDetailsDTO;
import com.ecommerce.customer_service.dto.OrderRequest;
import com.ecommerce.customer_service.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

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
                request.getDeliveryAddress(),
                productJson
        );
    }

    public List<OrderDTO> getAllOrdersForCustomer(String userId) {
        return orderRepository.getAllOrdersForCustomer(userId);
    }

    public List<OrderDetailsDTO> getAllOrderDetailsByOrderId(String orderId) {
        return orderRepository.getAllOrderDetailsByOrderId(orderId);
    }
}
