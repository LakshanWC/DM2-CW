package com.ecommerce.customer_service.dto;

import java.sql.Date;

public class DeliveryDTO {
    private int DeliveryID;
    private int OrderID;
    private Date EstimatedDate;
    private String DeliveryStatus;
    private String UserID;
    private String DeliveryAddress;

    public int getDeliveryID() {return DeliveryID;}

    public void setDeliveryID(int deliveryID) {DeliveryID = deliveryID;}

    public int getOrderID() {return OrderID;}

    public void setOrderID(int orderID) {OrderID = orderID;}

    public Date getEstimatedDate() {return EstimatedDate;}

    public void setEstimatedDate(Date estimatedDate) {EstimatedDate = estimatedDate;}

    public String getDeliveryStatus() {return DeliveryStatus;}

    public void setDeliveryStatus(String deliveryStatus) {DeliveryStatus = deliveryStatus;}

    public String getUserID() {return UserID;}

    public void setUserID(String userID) {UserID = userID;}

    public String getDeliveryAddress() {return DeliveryAddress;}
    public void setDeliveryAddress(String deliveryAddress) {DeliveryAddress = deliveryAddress;}
}