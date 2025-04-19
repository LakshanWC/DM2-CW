package com.example.admin_service.controller;

import com.example.admin_service.dto.SupplierDTO;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.admin_service.service.adminService;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class adminController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        String sql = "SELECT userid, name, username, email, address, status FROM Users";
        return jdbcTemplate.queryForList(sql);
    }

    @DeleteMapping("/remove-user/{username}")
    public String removeUser(@PathVariable String username) {
        String sql = "{ ? = call remove_user_by_username(?) }";
        return jdbcTemplate.execute((Connection connection) -> {
            try (CallableStatement cs = connection.prepareCall(sql)) {
                cs.registerOutParameter(1, Types.VARCHAR);
                cs.setString(2, username);
                cs.execute();
                return cs.getString(1);
            }
        });
    }

    @GetMapping("/suppliers")
    public List<SupplierDTO> getAllSuppliers() {
        String sql = "SELECT s.SUPPLIERID, s.USERID, u.NAME, u.EMAIL, s.PHONENUMBER, " +
                "s.ADDRESS, s.STATUS, u.USERNAME " +
                "FROM SUPPLIERS s JOIN USERS u ON s.USERID = u.USERID";

        return jdbcTemplate.query(sql, new SupplierRowMapper());
    }

    @PostMapping("/suppliers/{supplierId}/status")
    public String updateSupplierStatus(
            @PathVariable String supplierId,
            @RequestParam String newStatus) {

        String sql = "{ ? = call update_supplier_status(?, ?) }";

        return jdbcTemplate.execute((Connection connection) -> {
            try (CallableStatement cs = connection.prepareCall(sql)) {
                cs.registerOutParameter(1, Types.VARCHAR);
                cs.setString(2, supplierId);
                cs.setString(3, newStatus.toUpperCase()); // Ensure uppercase
                cs.execute();
                return cs.getString(1);
            }
        });
    }

    private static class SupplierRowMapper implements RowMapper<SupplierDTO> {
        @Override
        public SupplierDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            SupplierDTO supplier = new SupplierDTO();
            supplier.setSupplierId(rs.getString("SUPPLIERID"));
            supplier.setUserId(rs.getString("USERID"));
            supplier.setName(rs.getString("NAME"));
            supplier.setEmail(rs.getString("EMAIL"));
            supplier.setPhoneNumber(rs.getString("PHONENUMBER"));
            supplier.setAddress(rs.getString("ADDRESS"));
            supplier.setStatus(rs.getString("STATUS"));
            supplier.setUsername(rs.getString("USERNAME"));
            return supplier;
        }
    }

    @GetMapping("/payments")
    public List<Map<String, Object>> getAllPayments() {
        String sql = "SELECT paymentid, orderid, supplierid, userid, amount, paymentdate, status FROM Payments";
        return jdbcTemplate.queryForList(sql);
    }


    @GetMapping("/products")
    public List<Map<String, Object>> getAllProducts() {
        String sql = "SELECT productid, supplierid, productname, price, productcategory, " +
                "stockquantity, description, status FROM Products";
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping("/products/{productId}/status")
    public String updateProductStatus(
            @PathVariable String productId,
            @RequestParam String newStatus) {

        String sql = "{ ? = call update_product_status(?, ?) }";

        return jdbcTemplate.execute((Connection connection) -> {
            try (CallableStatement cs = connection.prepareCall(sql)) {
                cs.registerOutParameter(1, Types.VARCHAR);
                cs.setString(2, productId);
                cs.setString(3, newStatus.toUpperCase());
                cs.execute();
                return cs.getString(1);
            }
        });
    }

}


