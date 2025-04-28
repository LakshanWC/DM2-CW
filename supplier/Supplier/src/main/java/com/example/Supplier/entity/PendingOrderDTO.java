package com.example.Supplier.entity;

import java.math.BigDecimal;
import java.util.Date;

public class PendingOrderDTO {

    private Long orderId;
    private Date orderDate;
    private String orderStatus;
    private String paymentStatus;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double subTotal;
    private Long orderDetailId;
    private Date deliveredDate;

    public PendingOrderDTO(Object[] columns) {
        this.orderId = ((Number) columns[0]).longValue();      // OrderID
        this.orderDate = (Date) columns[1];                    // OrderDate
        this.orderStatus = (String) columns[2];                // Status
        this.paymentStatus = (String) columns[3];              // PaymentStatus
        this.productId = ((Number) columns[4]).longValue();    // ProductID
        this.productName = (String) columns[5];                // ProductName
        this.quantity = ((Number) columns[6]).intValue();      // Quantity
        this.subTotal = ((Number) columns[7]).doubleValue();   // SubTotal
        this.orderDetailId = ((Number) columns[8]).longValue();// OrderDetailID
        this.deliveredDate = columns[9] != null ? (Date) columns[9] : null; // DeliveredDate
    }


    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;

    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(Double subTotal) {
        this.subTotal = subTotal;
    }

    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    public Date getDeliveredDate() {
        return deliveredDate;
    }

    public void setDeliveredDate(Date deliveredDate) {
        this.deliveredDate = deliveredDate;
    }
}

