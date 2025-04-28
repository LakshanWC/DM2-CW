package com.example.Supplier.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "PRODUCTS")
@Data
public class Product {
    @Id
    @Column(name = "PRODUCTID")
    private Long productId;

    @Column(name = "SUPPLIERID")
    private String supplierId;


}
