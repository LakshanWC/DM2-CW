package com.ecommerce.customer_service.service;


import com.ecommerce.customer_service.dto.DeliveryDTO;
import com.ecommerce.customer_service.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    public List<DeliveryDTO> trackOrder(String userId){
        return deliveryRepository.trackOrder(userId);
    }
}
