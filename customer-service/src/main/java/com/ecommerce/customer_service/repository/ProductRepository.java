package com.ecommerce.customer_service.repository;

import com.ecommerce.customer_service.dto.ProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;


@Repository
public class ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<ProductDTO> getAllProducts(String category, Double price) {
        return jdbcTemplate.execute((CallableStatementCreator) con -> {
            CallableStatement cstmt = con.prepareCall("{ ? = call SYSTEM.getAllProducts(?, ?) }");
            cstmt.registerOutParameter(1, Types.REF_CURSOR);

            if (category != null) cstmt.setString(2, category);
            else cstmt.setNull(2, Types.VARCHAR);

            if (price != null) cstmt.setDouble(3, price);
            else cstmt.setNull(3, Types.NUMERIC);

            return cstmt;
        }, (CallableStatement cstmt) -> {
            cstmt.execute();
            ResultSet rs = (ResultSet) cstmt.getObject(1);

            List<ProductDTO> products = new ArrayList<>();
            while (rs.next()) {
                ProductDTO product = new ProductDTO();
                product.setProductID(rs.getString("PRODUCTID"));
                product.setSupplierID(rs.getString("SUPPLIERID"));
                product.setProductName(rs.getString("PRODUCTNAME"));
                product.setPrice(rs.getDouble("PRICE"));
                product.setProductCategory(rs.getString("PRODUCTCATEGORY"));
                product.setStockQuantity(rs.getInt("STOCKQUANTITY"));
                product.setDescription(rs.getString("DESCRIPTION"));
                product.setStatus(rs.getString("STATUS"));

                products.add(product);
            }
            rs.close(); // Optional but good practice
            return products;
        });
    }


    public String addProduct(String supplierID, String productName, Double price, String productCategory, Integer stockQuantity, String description) {
        return jdbcTemplate.execute((CallableStatementCreator) con -> {
            CallableStatement cstmt = con.prepareCall("{ ? = call SYSTEM.addProduct(?, ?, ?, ?, ?, ?) }");
            cstmt.registerOutParameter(1, Types.VARCHAR); // Return value

            cstmt.setString(2, supplierID);
            cstmt.setString(3, productName);

            if (price != null) cstmt.setDouble(4, price);
            else cstmt.setNull(4, Types.NUMERIC);

            cstmt.setString(5, productCategory);

            if (stockQuantity != null) cstmt.setInt(6, stockQuantity);
            else cstmt.setNull(6, Types.INTEGER);

            cstmt.setString(7, description);

            return cstmt;
        }, (CallableStatement cstmt) -> {
            cstmt.execute();
            return cstmt.getString(1); // Return the message from PL/SQL function
        });
    }



}
