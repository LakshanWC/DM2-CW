SET SERVEROUTPUT ON;

------------- USERS TABLE ---------------
CREATE TABLE Users (
    UserID VARCHAR2(10) PRIMARY KEY,
    UserName VARCHAR2(50) NOT NULL,
    Email VARCHAR2(50) UNIQUE,
    Address VARCHAR2(100),
    Status VARCHAR2(20) DEFAULT 'ACTIVE',
    Password VARCHAR2(50)
);

------------- CUSTOMERS TABLE ---------------
CREATE TABLE Customers (
    CustomerID VARCHAR2(10) PRIMARY KEY,  -- Format: CUS001, CUS002, etc.
    UserID VARCHAR2(10) REFERENCES Users(UserID),
    PhoneNumber VARCHAR2(20),
    DeliveryAddress VARCHAR2(100)
);

------------- SUPPLIERS TABLE ---------------
CREATE TABLE Suppliers (
   SupplierID VARCHAR2(10) PRIMARY KEY,  -- Format: SUP001, SUP002, etc.
   UserID VARCHAR2(10) REFERENCES Users(UserID),
  PhoneNumber VARCHAR2(20),
   Address VARCHAR2(100),
   Status VARCHAR2(20) DEFAULT 'ACTIVE'
); 
 
------------- PRODUCTS TABLE ---------------
CREATE TABLE Products (
   ProductID NUMBER PRIMARY KEY,
   SupplierID VARCHAR2(10) REFERENCES Suppliers(SupplierID),
   ProductName VARCHAR2(50) NOT NULL,
   Price NUMBER(10,2),
   ProductCategory VARCHAR2(50),
   StockQuantity NUMBER,
   Description VARCHAR2(100),
   Status VARCHAR2(10) DEFAULT 'ACTIVE'
);

------------- ORDERS TABLE ---------------
CREATE TABLE Orders (
   OrderID NUMBER PRIMARY KEY,
   OrderDate DATE DEFAULT SYSDATE,
   TotalAmount NUMBER(10,2),
   Status VARCHAR2(20) DEFAULT 'Pending' CHECK (
        Status IN ('Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled')
   ),
   PaymentStatus VARCHAR2(20) DEFAULT 'Pending' CHECK (
        PaymentStatus IN ('Pending', 'Completed', 'Failed', 'Refunded')
   ),
   PaymentType VARCHAR2(30) DEFAULT 'Cash on Delivery (COD)' CHECK (
        PaymentType IN ('Credit Card', 'Debit Card', 'Cash on Delivery (COD)')
   ),
   CustomerID VARCHAR2(10) REFERENCES Customers(CustomerID),
   CANCELLATION_REASON VARCHAR2(200)
);
ALTER TABLE Orders
ADD DeliveredDate DATE;


------------- ORDER DETAILS TABLE ---------------
CREATE TABLE Order_Details (
  OrderDetailID NUMBER PRIMARY KEY,
  OrderID NUMBER REFERENCES Orders(OrderID),
  ProductID NUMBER REFERENCES Products(ProductID),
  SupplierID VARCHAR2(10) REFERENCES Suppliers(SupplierID),
  Quantity NUMBER,
  SubTotal NUMBER(10,2)
);

------------- PAYMENTS TABLE ---------------
CREATE TABLE Payments (
  PaymentID NUMBER DEFAULT payment_seq.NEXTVAL PRIMARY KEY,
  OrderID NUMBER REFERENCES Orders(OrderID),
  SupplierID VARCHAR2(10) REFERENCES Suppliers(SupplierID),
  Amount NUMBER(10,2),
  PaymentDate DATE DEFAULT SYSDATE,
  Status VARCHAR2(20) DEFAULT 'Pending' CHECK (
    Status IN ('Pending', 'Completed', 'Failed', 'Refunded')
  ),
  UserID VARCHAR2(10) REFERENCES Users(UserID)
);

------------- DELIVERIES TABLE ---------------
CREATE TABLE Deliveries (
    DeliveryID NUMBER PRIMARY KEY,
    OrderID NUMBER REFERENCES Orders(OrderID),
    EstimatedDate DATE,
    DeliveryStatus VARCHAR2(20) DEFAULT 'Pending' CHECK (
        DeliveryStatus IN ('Pending', 'Accepted', 'Shipped', 'Delivered', 'Cancelled')
    ),
    UserID VARCHAR2(10) REFERENCES Users(UserID),
    DeliveredDate Date
);


------------- SYSTEM ADMINS TABLE ---------------
CREATE TABLE SystemAdmins (
    AdminID VARCHAR2(10) PRIMARY KEY,  -- Format: ADMIN001, ADMIN002, etc.
    UserID VARCHAR2(10) REFERENCES Users(UserID),
    PermissionType VARCHAR2(50)
);

------------- ROLES TABLE ---------------
CREATE TABLE Roles (
    RoleID NUMBER PRIMARY KEY,
    UserID VARCHAR2(10) REFERENCES Users(UserID),
    RoleType VARCHAR2(20) NOT NULL CHECK (
        RoleType IN ('Customer', 'Supplier', 'Admin')
    ),
    Status VARCHAR2(100)
);

------------- PERMISSIONS TABLE ---------------
CREATE TABLE Permissions (
    PermissionID NUMBER PRIMARY KEY,
    PermissionType VARCHAR2(50) NOT NULL,
    Description VARCHAR2(100),
    AssignedBy VARCHAR2(50)
);

------------- ROLE_PERMISSION (Junction Table) ---------------
CREATE TABLE Role_Permission (
    RoleID NUMBER REFERENCES Roles(RoleID),
    PermissionID NUMBER REFERENCES Permissions(PermissionID),
    PRIMARY KEY (RoleID, PermissionID)
);

-- 1. USERS (Format: U1, U2, etc.)
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U1', 'Supplier 1', 'sup1@gmail.com', 'Gampaha', 'Active',  'sup123');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U2', 'Supplier 2', 'sup2@gmail.com', 'Horana', 'Active', 'sup231');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U3', 'Supplier 3', 'sup3@gmail.com', 'Colombo', 'Active',  'sup321');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U4', 'Customer 1', 'cus1@gmail.com', 'Panadura', 'Active',  'cus123');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U5', 'Customer 2', 'cus2@gmail.com', 'Moratuwa', 'Active',  'cus231');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U7', 'Customer 3', 'cus3@gmail.com', 'Piliyandala', 'Active',  'cus321');
INSERT INTO Users (UserID, UserName, Email, Address, Status,  Password) VALUES ('U6', 'Admin 1', 'admin1@gmail.com', 'Bandaragama', 'Active', 'admin123');

select * from USERS;


-- 2. ROLES
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (1, 'U1', 'Supplier', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (2, 'U2', 'Supplier', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (3, 'U3', 'Supplier', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (4, 'U4', 'Customer', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (5, 'U5', 'Customer', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (6, 'U6', 'Admin', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (7, 'U7', 'Customer', 'Active');

select * from ROLES;

-- 3. CUSTOMERS (Format: CUS001, CUS002, etc.)
INSERT INTO Customers (CustomerID, UserID, PhoneNumber, DeliveryAddress) VALUES ('CUS001', 'U4', '078-777 0000', 'Welmilla');
INSERT INTO Customers (CustomerID, UserID, PhoneNumber, DeliveryAddress) VALUES ('CUS002', 'U5', '078-777 8888', 'Horowpathana');
INSERT INTO Customers (CustomerID, UserID, PhoneNumber, DeliveryAddress) VALUES ('CUS003', 'U7', '071-775 8888', 'Malabe');

select * from Customers;

-- 4. SUPPLIERS (Format: SUP001, SUP002, etc.)
INSERT INTO Suppliers (SupplierID, UserID, PhoneNumber, Address, Status) VALUES ('SUP001', 'U1', '077-111 1111', 'Gampaha', 'ACTIVE');
INSERT INTO Suppliers (SupplierID, UserID, PhoneNumber, Address, Status) VALUES ('SUP002', 'U2', '077-777 7777', 'Horana', 'ACTIVE');
INSERT INTO Suppliers (SupplierID, UserID, PhoneNumber, Address, Status) VALUES ('SUP003', 'U3', '078-888 8888', 'Bandaragama', 'ACTIVE');

select * from Suppliers;

-- 5. SYSTEM ADMINS (Format: ADMIN001, ADMIN002, etc.)
INSERT INTO SystemAdmins (AdminID, UserID, PermissionType) VALUES ('ADMIN001', 'U6', 'Full Access');

select * from systemadmins;

-- 6. PERMISSIONS
INSERT INTO Permissions (PermissionID, PermissionType, Description, AssignedBy) VALUES (1, 'View Orders', 'Can view all order details', 'ADMIN001');
INSERT INTO Permissions (PermissionID, PermissionType, Description, AssignedBy) VALUES (2, 'Manage Products', 'Can manage product listings', 'ADMIN001');
INSERT INTO Permissions (PermissionID, PermissionType, Description, AssignedBy) VALUES (3, 'Full Access', 'Access to all system modules', 'ADMIN001');

select * from Permissions;

-- 7. ROLE-PERMISSION
INSERT INTO Role_Permission (RoleID, PermissionID) VALUES (1, 1); -- Customer: View Orders
INSERT INTO Role_Permission (RoleID, PermissionID) VALUES (2, 2); -- Supplier: Manage Products
INSERT INTO Role_Permission (RoleID, PermissionID) VALUES (3, 3); -- Admin: Full Access

select * from Role_Permission;

-- 8. PRODUCTS
INSERT INTO Products (ProductID, SupplierID, ProductName, Price, ProductCategory, StockQuantity, Description, Status)
VALUES (101, 'SUP001', 'Chocalte Biscuit', 150.00, 'Snacks', 100, 'Creamy Chocalate Biscuit', 'ACTIVE');

INSERT INTO Products (ProductID, SupplierID, ProductName, Price, ProductCategory, StockQuantity, Description, Status)
VALUES (102, 'SUP002', 'Ramen Noodles', 250.00, 'Grains', 80, 'Spicy Ramen', 'ACTIVE');

INSERT INTO Products (ProductID, SupplierID, ProductName, Price, ProductCategory, StockQuantity, Description, Status)
VALUES (103, 'SUP003', 'Yoghurt', 70.00, 'Dairy', 60, 'Sweet Milcky Yoghurt', 'ACTIVE');

select * from Products;

-- 9. ORDERS
-- Order 1001: 5×150 + 14×70 = 750 + 980 = 1730
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1001, SYSDATE, 1730.00, 'Pending', 'Completed', 'Credit Card', 'CUS001');

-- Order 1002: 10×150 = 1500
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1002, SYSDATE, 1500.00, 'Pending', 'Completed', 'Credit Card', 'CUS001');

-- Order 1003: 5×250 = 1250
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1003, SYSDATE, 1250.00, 'Pending', 'Pending', 'Credit Card', 'CUS002');

-- Order 1004: 8×70 + 4×250 = 560 + 1000 = 1560
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1004, SYSDATE, 1560.00, 'Pending', 'Completed', 'Cash on Delivery (COD)', 'CUS003');

-- Order 1005: 3×250 + 6×150 = 750 + 900 = 1650
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1005, SYSDATE, 1650.00, 'Pending', 'Failed', 'Credit Card', 'CUS002');

-- Order 1006: 12×70 = 840
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1006, SYSDATE, 840.00, 'Pending', 'Completed', 'Cash on Delivery (COD)', 'CUS003');

-- Order 1007: 7×150 + 2×250 + 5×70 = 1050 + 500 + 350 = 1900
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1007, SYSDATE, 1900.00, 'Pending', 'Pending', 'Credit Card', 'CUS001');

select * from Orders;

-- 10. ORDER DETAILS
INSERT INTO ORDER_DETAILS (ORDERDETAILID, ORDERID, PRODUCTID, SUPPLIERID, QUANTITY, SUBTOTAL)
VALUES (1, 1001, 101, 'SUP001', 5, 750.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (2, 1002, 101, 'SUP001', 10, 1500.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (3, 1003, 102, 'SUP002', 5, 1250.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (4, 1001, 103, 'SUP003', 14, 980.00);

-- Order 1004 Details
INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (5, 1004, 103, 'SUP003', 8, 560.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (6, 1004, 102, 'SUP002', 4, 1000.00);

-- Order 1005 Details
INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (7, 1005, 102, 'SUP002', 3, 750.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (8, 1005, 101, 'SUP001', 6, 900.00);

-- Order 1006 Details
INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (9, 1006, 103, 'SUP003', 12, 840.00);

-- Order 1007 Details
INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (10, 1007, 101, 'SUP001', 7, 1050.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (11, 1007, 102, 'SUP002', 2, 500.00);

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, SupplierID, Quantity, SubTotal)
VALUES (12, 1007, 103, 'SUP003', 5, 350.00);

select * from Order_Details;

-- 11. PAYMENTS
INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (201, 1002, 'SUP001', 1500.00, SYSDATE, 'Pending', 'U4');

INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (202, 1001, 'SUP001', 1730, SYSDATE, 'Pending', 'U4');

INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (203, 1003, 'SUP002', 1250, SYSDATE, 'Pending', 'U5');


select * from Payments;

-- 12. DELIVERIES
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (101, 1002, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 'Pending', 'U1');

-- Delivery for Order 1001 by Supplier SUP001 (UserID = U1)
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (102, 1001, TO_DATE('2025-04-08', 'YYYY-MM-DD'), 'Pending', 'U1');

-- Delivery for Order 1002 by Supplier SUP003 (UserID = U3)
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (103, 1002, TO_DATE('2025-04-12', 'YYYY-MM-DD'), 'Pending', 'U3');

-- Delivery for Order 1003 by Supplier SUP002 (UserID = U2)
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (104, 1003, TO_DATE('2025-04-14', 'YYYY-MM-DD'), 'Pending', 'U2');

-- Delivery for Order 1004 by Supplier SUP003 (UserID = U3)
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (105, 1004, TO_DATE('2025-04-16', 'YYYY-MM-DD'), 'Pending', 'U3');

-- Delivery for Order 1005
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (106, 1005, TO_DATE('2025-04-18', 'YYYY-MM-DD'), 'Pending', 'U2');

-- Delivery for Order 1006
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (107, 1006, TO_DATE('2025-04-19', 'YYYY-MM-DD'), 'Pending', 'U3');

-- Delivery for Order 1007
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (108, 1007, TO_DATE('2025-04-20', 'YYYY-MM-DD'), 'Pending', 'U1');

select * from Products;
select * from Orders;
select * from Order_Details;
select * from Deliveries;


--DROP TABLE Role_Permission
DROP TABLE Role_Permission;

-- Drop dependent tables
DROP TABLE Order_Details;
DROP TABLE Payments;
DROP TABLE Deliveries;

-- Drop mid-level dependent tables
DROP TABLE Orders;
DROP TABLE Products;

-- Drop role-related tables
DROP TABLE Roles;
DROP TABLE SystemAdmins;
DROP TABLE Permissions;

-- Drop primary entity tables
DROP TABLE Customers;
DROP TABLE Suppliers;

-- Finally, drop Users table (since most others reference it)
DROP TABLE Users;

-- Clear existing data first (if needed)
DELETE FROM ORDER_DETAILS;
DELETE FROM PAYMENTS;
DELETE FROM DELIVERIES;
DELETE FROM ORDERS;
DELETE FROM PRODUCTS;
DELETE FROM CUSTOMERS;
DELETE FROM SUPPLIERS;
DELETE FROM SYSTEMADMINS;
DELETE FROM ROLES;
DELETE FROM ROLE_PERMISSION;
DELETE FROM PERMISSIONS;
DELETE FROM USERS;
