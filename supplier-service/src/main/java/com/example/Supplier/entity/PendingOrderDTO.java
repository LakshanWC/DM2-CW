package com.example.Supplier.entity;

import java.util.Date;

public class PendingOrderDTO {
    private Long orderId;
    private Date orderDate;
    private String orderStatus;
    private String paymentStatus; // Added this field
    private Long productId;
    private String productName;
    private Integer quantity;
    private Double subTotal;
    private Long orderDetailId;

    // Constructor from Object array
    public PendingOrderDTO(Object[] result) {
        this.orderId = ((Number) result[0]).longValue();
        this.orderDate = (Date) result[1];
        this.orderStatus = (String) result[2];
        this.paymentStatus = (String) result[3]; // Added this mapping
        this.productId = ((Number) result[4]).longValue();
        this.productName = (String) result[5];
        this.quantity = ((Number) result[6]).intValue();
        this.subTotal = ((Number) result[7]).doubleValue();
        this.orderDetailId = ((Number) result[8]).longValue();
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

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
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
}
