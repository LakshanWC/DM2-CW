package com.ecommerce.customer_service.dto;

public class ProductDTO {
    String productID;
    String supplierID;
    String productName;
    Double price;
    String productCategory;
    int stockQuantity;
    String description;
    String status;

    public String getProductID() {return productID;}

    public void setProductID(String productID) {this.productID = productID;}

    public String getSupplierID() {return supplierID;}

    public void setSupplierID(String supplierID) {this.supplierID = supplierID;}

    public String getProductName() {return productName;}

    public void setProductName(String productName) {this.productName = productName;}

    public Double getPrice() {return price;}

    public void setPrice(Double price) {this.price = price;}

    public String getProductCategory() {return productCategory;}

    public void setProductCategory(String productCategory) {this.productCategory = productCategory;}

    public int getStockQuantity() {return stockQuantity;}

    public void setStockQuantity(int stockQuantity) {this.stockQuantity = stockQuantity;}

    public String getDescription() {return description;}

    public void setDescription(String description) {this.description = description;}

    public String getStatus() {return status;}

    public void setStatus(String status) {this.status = status;}
}
