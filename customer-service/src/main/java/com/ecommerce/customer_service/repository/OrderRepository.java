package com.ecommerce.customer_service.repository;

import com.ecommerce.customer_service.dto.OrderDTO;
import com.ecommerce.customer_service.dto.OrderDetailsDTO;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.io.StringReader;
import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OrderRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String saveOrder(String orderDate, String paymentType, String userId, String productJson) {
        System.out.println("Product JSON: " + productJson);
        return jdbcTemplate.execute(
                (CallableStatementCreator) connection -> {
                    CallableStatement cs = connection.prepareCall("{ ? = call SYSTEM.saveOrder(?, ?, ?, ?) }");
                    cs.registerOutParameter(1, Types.VARCHAR); // return value
                    cs.setDate(2, java.sql.Date.valueOf(orderDate));
                    cs.setString(3, paymentType);
                    cs.setString(4, userId);
                    cs.setCharacterStream(5, new StringReader(productJson));
                    return cs;
                },
                (CallableStatementCallback<String>) cs -> {
                    cs.execute();
                    return cs.getString(1); // return value from the function
                }
        );
    }

    public List<OrderDTO> getAllOrdersForCustomer(String userId) {
        try {
            return jdbcTemplate.execute((CallableStatementCreator) con -> {
                CallableStatement cstmt = con.prepareCall("{ ? = call SYSTEM.GETALLORDERS(?) }");
                cstmt.registerOutParameter(1, Types.REF_CURSOR);

                if (userId != null) {
                    cstmt.setString(2, userId);
                } else {
                    cstmt.setNull(2, Types.VARCHAR);
                }

                return cstmt;
            }, (CallableStatement cstmt) -> {
                cstmt.execute();
                ResultSet rs = (ResultSet) cstmt.getObject(1);

                List<OrderDTO> orders = new ArrayList<>();

                while (rs.next()) {
                    OrderDTO order = new OrderDTO();
                    order.setOrderId(rs.getInt("ORDERID"));
                    order.setOrderDate(rs.getDate("ORDERDATE"));
                    order.setTotalAmount(rs.getDouble("TOTALAMOUNT"));
                    order.setStatus(rs.getString("STATUS"));
                    order.setPaymenetStatus(rs.getString("PAYMENTSTATUS"));
                    order.setPaymentType(rs.getString("PAYMENTTYPE"));
                    order.setCustomerId(rs.getString("CUSTOMERID"));
                    orders.add(order);
                }

                rs.close(); // good practice

                return orders;
            });
        }catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }



    public List<OrderDetailsDTO> getAllOrderDetailsByOrderId(String orderId) {
        return jdbcTemplate.execute((CallableStatementCreator) con -> {
            CallableStatement cstmt = con.prepareCall("{ ? = call SYSTEM.GETALLDETAILS(?) }");
            cstmt.registerOutParameter(1, Types.REF_CURSOR);

            if (orderId != null) {
                cstmt.setString(2, orderId);
            } else {
                cstmt.setNull(2, Types.VARCHAR);
            }

            return cstmt;
        }, (CallableStatement cstmt) -> {
            cstmt.execute();
            ResultSet rs = (ResultSet) cstmt.getObject(1);

            List<OrderDetailsDTO> details = new ArrayList<>();

            while (rs.next()) {
                OrderDetailsDTO orderDetailsDTO = new OrderDetailsDTO();
                orderDetailsDTO.setOrderDetailId(rs.getInt("ORDERDETAILID"));
                orderDetailsDTO.setOrderId(rs.getInt("ORDERID"));
                orderDetailsDTO.setProductId(rs.getInt("PRODUCTID"));
                orderDetailsDTO.setQuantity(rs.getInt("QUANTITY"));
                orderDetailsDTO.setSubTotal(rs.getDouble("SUBTOTAL"));
                details.add(orderDetailsDTO);
            }

            rs.close(); // good practice

            return details;
        });
    }


}