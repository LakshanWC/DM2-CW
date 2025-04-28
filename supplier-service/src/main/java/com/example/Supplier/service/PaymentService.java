package com.example.Supplier.service;

import com.example.Supplier.entity.Payment;
import com.example.Supplier.entity.PaymentDTO;
import com.example.Supplier.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentDTO recordPayment(PaymentDTO paymentDTO) {
        Payment payment = new Payment();
        payment.setOrderId(paymentDTO.getOrderId());
        payment.setSupplierId(paymentDTO.getSupplierId());
        payment.setAmount(paymentDTO.getAmount());
        payment.setStatus(paymentDTO.getStatus() != null ? paymentDTO.getStatus() : "Pending");
        payment.setUserId(paymentDTO.getUserId());

        Payment savedPayment = paymentRepository.save(payment);

        return convertToDTO(savedPayment);
    }

    public List<PaymentDTO> getPaymentHistory(String supplierId, String status,
                                              Date startDate, Date endDate) {
        List<Object[]> results = paymentRepository.getPaymentHistory(
                supplierId, status, startDate, endDate);
        return results.stream()
                .map(PaymentDTO::new)
                .collect(Collectors.toList());
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setOrderId(payment.getOrderId());
        dto.setSupplierId(payment.getSupplierId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setStatus(payment.getStatus());
        dto.setUserId(payment.getUserId());
        return dto;
    }
}
