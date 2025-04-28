package com.example.Supplier.controller;

import com.example.Supplier.entity.PendingOrderDTO;
import com.example.Supplier.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    //http://localhost:8080/api/supplier/orders/all?supplierId=SUP001
    @GetMapping("/all")  // Changed from "/pending" to "/all"
    public ResponseEntity<List<PendingOrderDTO>> getAllOrders(
            @RequestParam String supplierId) {
        List<PendingOrderDTO> orders = orderService.getAllOrdersBySupplier(supplierId);
        return ResponseEntity.ok(orders);
    }

    //http://localhost:8080/api/supplier/orders/pending?supplierId=SUP001
    @GetMapping("/pending")
    public ResponseEntity<List<PendingOrderDTO>> getPendingOrders(
            @RequestParam String supplierId) {
        List<PendingOrderDTO> orders = orderService.getPendingOrders(supplierId);
        return ResponseEntity.ok(orders);
    }

    //http://localhost:8083/api/supplier/orders/1/accept?supplierId=SUP001
    @PostMapping("/{orderDetailId}/accept")
    public ResponseEntity<String> acceptOrder(
            @PathVariable Long orderDetailId,
            @RequestParam String supplierId) {
        try {
            orderService.acceptOrder(orderDetailId, supplierId);
            return ResponseEntity.ok("Order accepted successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/{orderDetailId}/cancel")
    public ResponseEntity<String> cancelOrder(
            @PathVariable Long orderDetailId,
            @RequestParam String supplierId,
            @RequestParam String reason) {
        try {
            orderService.cancelOrder(orderDetailId, supplierId, reason);
            return ResponseEntity.ok("Order cancelled successfully. Reason: " + reason);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Unexpected error: " + e.getMessage());
        }
    }

    //http://localhost:8083/api/supplier/orders/1001/status?supplierId=SUP001&newStatus=Shipped
    @PutMapping("/{orderId}/status")
    public String updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String supplierId,
            @RequestParam String newStatus) {
        orderService.updateOrderStatus(orderId, supplierId, newStatus);
        return "Order status updated to: " + newStatus;
    }
}
