package com.example.Supplier.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ORDER_DETAILS")
@Data
public class OrderDetail {
    @Id
    @Column(name = "ORDERDETAILID")
    private Long orderDetailId;

    @ManyToOne
    @JoinColumn(name = "ORDERID", referencedColumnName = "ORDERID")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "PRODUCTID", referencedColumnName = "PRODUCTID")
    private Product product;

    @Column(name = "SUPPLIERID")
    private String supplierId;

    @Column(name = "QUANTITY")
    private Integer quantity;

    @Column(name = "SUBTOTAL")
    private Double subTotal;
}