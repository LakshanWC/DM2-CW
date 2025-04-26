package com.ecommerce.customer_service.repository;

import com.ecommerce.customer_service.dto.DeliveryDTO;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DeliveryRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DeliveryDTO> trackOrder(String userId) {
        return jdbcTemplate.execute((CallableStatementCreator) con -> {
            // Prepare the call for the function and register the OUT parameter (REF CURSOR)
            CallableStatement cstmt = con.prepareCall("{ ? = call SYSTEM.GETDELIVERYORDERS(?) }");
            cstmt.registerOutParameter(1, Types.REF_CURSOR);

            // Set the input parameter for userId
            if (userId != null) {
                cstmt.setString(2, userId);
            } else {
                cstmt.setNull(2, Types.VARCHAR);
            }

            return cstmt;
        }, (CallableStatement cstmt) -> {
            // Execute the callable statement
            cstmt.execute();

            // Get the result set (REF_CURSOR) from the function
            ResultSet rs = (ResultSet) cstmt.getObject(1);

            // Create a list to hold the DeliveryDTO objects
            List<DeliveryDTO> deliveries = new ArrayList<>();

            // Map the ResultSet to DeliveryDTO
            while (rs.next()) {
                DeliveryDTO delivery = new DeliveryDTO();
                delivery.setDeliveryID(rs.getInt("DELIVERYID"));
                delivery.setOrderID(rs.getInt("ORDERID"));
                delivery.setEstimatedDate(rs.getDate("ESTIMATEDDATE"));
                delivery.setDeliveryStatus(rs.getString("DELIVERYSTATUS"));
                delivery.setUserID(rs.getString("USERID"));
                delivery.setDeliveryAddress(rs.getString("DELIVERYADDRESS"));
                deliveries.add(delivery);
            }

            rs.close(); // Close the ResultSet to avoid memory leaks (optional but good practice)

            return deliveries;
        });
    }
}
