package com.ecommerce.customer_service.dto;

import java.sql.Date;

public class OrderDTO {
    private int orderId;
    private Date orderDate;
    private Double totalAmount;
    private String status;
    private String paymenetStatus;
    private String paymentType;
    private String customerId;

    public int getOrderId() {return orderId;}

    public void setOrderId(int orderId) {this.orderId = orderId;}

    public Date getOrderDate() {return orderDate;}

    public void setOrderDate(Date orderDate) {this.orderDate = orderDate;}

    public Double getTotalAmount() {return totalAmount;}

    public void setTotalAmount(Double totalAmount) {this.totalAmount = totalAmount;}

    public String getStatus() {return status;}

    public void setStatus(String status) {this.status = status;}

    public String getPaymenetStatus() {return paymenetStatus;}

    public void setPaymenetStatus(String paymenetStatus) {this.paymenetStatus = paymenetStatus;}

    public String getPaymentType() {return paymentType;}

    public void setPaymentType(String paymentType) {this.paymentType = paymentType;}

    public String getCustomerId() {return customerId;}

    public void setCustomerId(String customerId) {this.customerId = customerId;}
}