package com.example.Supplier.controller;

import com.example.Supplier.entity.Payment;
import com.example.Supplier.entity.PaymentDTO;
import com.example.Supplier.repository.PaymentRepository;
import com.example.Supplier.service.PaymentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/supplier/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService paymentService, PaymentRepository paymentRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getPaymentHistory(
            @RequestParam String supplierId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentHistory(
                supplierId, status, startDate, endDate);
        return ResponseEntity.ok(payments);
    }

    //http://localhost:8080/api/supplier/payments/verify
    @PostMapping("/verify")
    public ResponseEntity<String> testPaymentVerification(
            @RequestBody PaymentDTO paymentDTO) {
        try {
            Payment payment = new Payment();
            payment.setOrderId(paymentDTO.getOrderId());
            payment.setAmount(paymentDTO.getAmount());

            paymentRepository.save(payment); // Trigger will execute here

            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Payment rejected: " + e.getMessage());
        }
    }
}