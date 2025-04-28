package com.example.Supplier.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "ORDERS")
@Data
public class Order {
    @Id
    @Column(name = "ORDERID")
    private Long orderId;

    @Column(name = "ORDERDATE")
    private Date orderDate;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "PAYMENTSTATUS")
    private String paymentStatus;

    @Column(name = "TOTALAMOUNT")
    private Double totalAmount;

    @Column(name = "CUSTOMERID")
    private String customerId;

    @OneToMany(mappedBy = "order")
    private List<OrderDetail> orderDetails;

    @Column(name = "DELIVEREDDATE")
    private Date deliveredDate;

}