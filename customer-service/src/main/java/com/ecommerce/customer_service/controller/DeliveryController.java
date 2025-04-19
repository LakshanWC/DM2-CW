package com.ecommerce.customer_service.controller;

import com.ecommerce.customer_service.dto.DeliveryDTO;
import com.ecommerce.customer_service.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping(path = "/{userId}")
    public List<DeliveryDTO> trackOrder(@PathVariable String userId) {
        System.out.println("Executing trackOrder with userId: " + userId);
        return deliveryService.trackOrder(userId);
    }
}
