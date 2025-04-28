package com.example.Supplier.service;

import com.example.Supplier.entity.PendingOrderDTO;
import com.example.Supplier.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<PendingOrderDTO> getAllOrdersBySupplier(String supplierId) {
        List<Object[]> results = orderRepository.findAllOrdersBySupplier(supplierId);
        return results.stream()
                .map(PendingOrderDTO::new)
                .collect(Collectors.toList());
    }

    public List<PendingOrderDTO> getPendingOrders(String supplierId) {
        List<Object[]> results = orderRepository.findPendingOrdersBySupplier(supplierId);
        return results.stream()
                .map(PendingOrderDTO::new)
                .collect(Collectors.toList());
    }

    public void acceptOrder(Long orderDetailId, String supplierId) {
        orderRepository.acceptOrder(orderDetailId, supplierId);
    }


    public void cancelOrder(Long orderDetailId, String supplierId, String reason) {
        orderRepository.cancelOrder(orderDetailId, supplierId, reason);
    }

    public void updateOrderStatus(Long orderId, String supplierId, String newStatus) {
        orderRepository.updateOrderStatus(orderId, supplierId, newStatus);
    }
}