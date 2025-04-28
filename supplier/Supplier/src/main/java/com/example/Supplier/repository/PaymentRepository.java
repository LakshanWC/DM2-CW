package com.example.Supplier.repository;

import com.example.Supplier.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Existing payment history query (unchanged)
    @Query(nativeQuery = true, value =
            "SELECT p.PaymentID, p.OrderID, p.Amount, p.PaymentDate, p.Status, " +
                    "o.OrderDate, o.TotalAmount, p.UserID " +
                    "FROM Payments p " +
                    "JOIN Orders o ON p.OrderID = o.OrderID " +
                    "WHERE p.SupplierID = :supplierId " +
                    "AND (:status IS NULL OR p.Status = :status) " +
                    "AND (:startDate IS NULL OR p.PaymentDate >= :startDate) " +
                    "AND (:endDate IS NULL OR p.PaymentDate <= :endDate) " +
                    "ORDER BY p.PaymentDate DESC")
    List<Object[]> getPaymentHistory(
            @Param("supplierId") String supplierId,
            @Param("status") String status,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    // New methods for payment validation
    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.orderId = :orderId")
    Double getTotalPaidAmount(@Param("orderId") Long orderId);

    @Query("SELECT COUNT(p) > 0 FROM Payment p WHERE p.orderId = :orderId AND p.status = 'Refunded'")
    boolean hasRefunds(@Param("orderId") Long orderId);

    @Query("SELECT p.supplierId FROM Payment p WHERE p.orderId = :orderId GROUP BY p.supplierId")
    List<String> findSupplierIdsByOrder(@Param("orderId") Long orderId);

    // For batch operations
    @Modifying
    @Query("UPDATE Payment p SET p.status = :status WHERE p.orderId = :orderId")
    int bulkUpdateStatus(@Param("orderId") Long orderId, @Param("status") String status);

    // For reconciliation reports
    @Query(nativeQuery = true, value =
            "SELECT EXTRACT(MONTH FROM p.paymentDate) as month, " +
                    "SUM(p.amount) as paid, " +
                    "SUM(o.totalAmount) as invoiced " +
                    "FROM Payments p JOIN Orders o ON p.orderId = o.orderId " +
                    "WHERE p.supplierId = :supplierId " +
                    "AND EXTRACT(YEAR FROM p.paymentDate) = :year " +
                    "GROUP BY EXTRACT(MONTH FROM p.paymentDate)")
    List<Object[]> getMonthlyReconciliation(
            @Param("supplierId") String supplierId,
            @Param("year") int year);
}