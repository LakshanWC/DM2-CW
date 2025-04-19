package com.ecommerce.customer_service.controller;

import com.ecommerce.customer_service.dto.OrderDTO;
import com.ecommerce.customer_service.dto.OrderDetailsDTO;
import com.ecommerce.customer_service.dto.OrderRequest;
import com.ecommerce.customer_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest request) {
        try {
            String message = orderService.createOrder(request);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public List<OrderDTO> getAllOrdersForCustomer(@PathVariable String userId) {
        return orderService.getAllOrdersForCustomer(userId);
    }

    @GetMapping("/{orderId}/details")
    public List<OrderDetailsDTO> getAllOrderDetailsByOrderId(@PathVariable String orderId) {
        return orderService.getAllOrderDetailsByOrderId(orderId);
    }
}
