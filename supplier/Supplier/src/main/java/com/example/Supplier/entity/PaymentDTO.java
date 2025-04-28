package com.example.Supplier.entity;

import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class PaymentDTO {
    private Long paymentId;
    private Long orderId;
    private String supplierId;
    private Double amount;
    private Date paymentDate;
    private String status;
    private Date orderDate;
    private Double totalAmount;
    private String userId;

    // Constructor from Object array (for query results)
    public PaymentDTO(Object[] result) {
        this.paymentId = ((Number) result[0]).longValue();
        this.orderId = ((Number) result[1]).longValue();
        this.amount = ((Number) result[2]).doubleValue();
        this.paymentDate = (Date) result[3];
        this.status = (String) result[4];
        this.orderDate = (Date) result[5];
        this.totalAmount = ((Number) result[6]).doubleValue();

        if (result.length > 7) {
            this.userId = (String) result[7];
        }
    }

    // Getters and Setters
    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}