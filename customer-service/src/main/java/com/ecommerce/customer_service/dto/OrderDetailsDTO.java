package com.ecommerce.customer_service.dto;

import java.sql.Date;

public class OrderDetailsDTO {
    private int orderDetailId;
    private int orderId;
    private int productId;
    private int quantity;
    private Double subTotal;

    public int getOrderDetailId() {return orderDetailId;}

    public void setOrderDetailId(int orderDetailId) {this.orderDetailId = orderDetailId;}

    public int getOrderId() {return orderId;}

    public void setOrderId(int orderId) {this.orderId = orderId;}

    public int getProductId() {return productId;}

    public void setProductId(int productId) {this.productId = productId;}

    public int getQuantity() {return quantity;}

    public void setQuantity(int quantity) {this.quantity = quantity;}

    public Double getSubTotal() {return subTotal;}

    public void setSubTotal(Double subTotal) {this.subTotal = subTotal;}
}