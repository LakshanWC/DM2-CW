package com.example.Supplier.repository;

import com.example.Supplier.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderDetail, Long> {

    @Procedure(procedureName = "SYSTEM.accept_order")
    void acceptOrder(
            @Param("p_order_detail_id") Long orderDetailId,
            @Param("p_supplier_id") String supplierId);

    @Procedure(procedureName = "SYSTEM.cancelled_order")
    void cancelOrder(
            @Param("p_order_detail_id") Long orderDetailId,
            @Param("p_supplier_id") String supplierId,
            @Param("p_reason") String reason);

    @Procedure(procedureName = "SYSTEM.update_order_status")
    void updateOrderStatus(
            @Param("p_order_id") Long orderId,
            @Param("p_supplier_id") String supplierId,
            @Param("p_new_status") String newStatus);

    @Query(nativeQuery = true, value =
            "SELECT o.OrderID, o.OrderDate, o.Status AS OrderStatus,o.PaymentStatus AS PaymentStatus, " +
                    "p.ProductID, p.ProductName, od.Quantity, od.SubTotal, od.OrderDetailID " +
                    "FROM SYSTEM.Orders o " +
                    "JOIN SYSTEM.Order_Details od ON o.OrderID = od.OrderID " +
                    "JOIN SYSTEM.Products p ON od.ProductID = p.ProductID " +
                    "WHERE p.SupplierID = :supplierId " +
                    "ORDER BY o.OrderDate DESC")
    List<Object[]> findAllOrdersBySupplier(@Param("supplierId") String supplierId);

    @Query(nativeQuery = true, value =
            "SELECT o.OrderID, o.OrderDate, o.Status AS OrderStatus,o.PaymentStatus AS PaymentStatus, " +
                    "p.ProductID, p.ProductName, od.Quantity, od.SubTotal, od.OrderDetailID " +
                    "FROM SYSTEM.Orders o " +
                    "JOIN SYSTEM.Order_Details od ON o.OrderID = od.OrderID " +
                    "JOIN SYSTEM.Products p ON od.ProductID = p.ProductID " +
                    "WHERE p.SupplierID = :supplierId " +
                    "AND o.Status = 'Pending' " +
                    "ORDER BY o.OrderDate DESC")
    List<Object[]> findPendingOrdersBySupplier(@Param("supplierId") String supplierId);

    // Updated query with proper entity relationships
    @Query("SELECT CASE WHEN COUNT(od) > 0 THEN true ELSE false END " +
            "FROM OrderDetail od " +
            "JOIN od.product p " +  // Using the mapped relationship
            "WHERE od.orderDetailId = :orderDetailId " +
            "AND p.supplierId = :supplierId")
    boolean existsByOrderDetailIdAndSupplierId(
            @Param("orderDetailId") Long orderDetailId,
            @Param("supplierId") String supplierId);

    // Updated query with proper entity relationships
    @Query("SELECT od FROM OrderDetail od " +
            "JOIN od.product p " +  // Using the mapped relationship
            "WHERE od.orderDetailId = :orderDetailId " +
            "AND p.supplierId = :supplierId")
    Optional<OrderDetail> findByOrderDetailIdAndSupplierId(
            @Param("orderDetailId") Long orderDetailId,
            @Param("supplierId") String supplierId);

    // Updated query with proper entity relationships
    @Query("SELECT o.status FROM Order o " +
            "JOIN o.orderDetails od " +  // Assuming you have this relationship in Order entity
            "WHERE od.orderDetailId = :orderDetailId")
    Optional<String> findOrderStatusByOrderDetailId(
            @Param("orderDetailId") Long orderDetailId);
}