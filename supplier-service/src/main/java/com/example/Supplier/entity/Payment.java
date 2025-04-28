package com.example.Supplier.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "SYSTEM.PAYMENTS")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "payment_seq")
    @SequenceGenerator(
            name = "payment_seq",
            sequenceName = "PAYMENT_SEQ",
            allocationSize = 1,
            initialValue = 203 // Add this line
    )
    @Column(name = "PAYMENTID")
    private Long paymentId;

    @Column(name = "ORDERID")
    private Long orderId;

    @Column(name = "SUPPLIERID")
    private String supplierId;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "PAYMENTDATE", nullable = false)
    private Date paymentDate = new Date();

    @Column(name = "STATUS")
    private String status;

    @Column(name = "USERID")
    private String userId;
}