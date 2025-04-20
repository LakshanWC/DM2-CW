SET SERVEROUTPUT ON;

------------- USERS TABLE ---------------
CREATE TABLE Users (
    UserID VARCHAR2(10) PRIMARY KEY,  -- Format: U1, U2, etc.
    Name VARCHAR2(50) NOT NULL,
    Email VARCHAR2(50) UNIQUE,
    Address VARCHAR2(100),
    Status VARCHAR2(20) DEFAULT 'ACTIVE',
    Username VARCHAR2(50),
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
        Status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
   ),
   PaymentStatus VARCHAR2(20) DEFAULT 'Pending' CHECK (
        PaymentStatus IN ('Pending', 'Partial', 'Completed', 'Refunded')
   ),
   PaymentType VARCHAR2(30) DEFAULT 'Cash on Delivery (COD)' CHECK (
        PaymentType IN ('Credit Card', 'Debit Card', 'Cash on Delivery (COD)')
   ),
   CustomerID VARCHAR2(10) REFERENCES Customers(CustomerID)
);

------------- ORDER DETAILS TABLE ---------------
CREATE TABLE Order_Details (
  OrderDetailID NUMBER PRIMARY KEY,
  OrderID NUMBER REFERENCES Orders(OrderID),
  ProductID NUMBER REFERENCES Products(ProductID),
  Quantity NUMBER,
  SubTotal NUMBER(10,2)
);

------------- PAYMENTS TABLE ---------------
CREATE TABLE Payments (
  PaymentID NUMBER PRIMARY KEY,
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
        DeliveryStatus IN ('Pending', 'Shipped', 'Delivered', 'Failed')
    ),
    UserID VARCHAR2(10) REFERENCES Users(UserID)
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

--------------------------------------------------
-- INSERT SAMPLE DATA (ORDERED TO AVOID FK ERRORS)
--------------------------------------------------

-- 1. USERS (Format: U1, U2, etc.)
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U1', 'Supplier 1', 'sup1@gmail.com', 'Gampaha', 'Active', 'sup1', 'sup123');
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U2', 'Supplier 2', 'sup2@gmail.com', 'Horana', 'Active', 'sup2', 'sup123');
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U3', 'Supplier 3', 'sup3@gmail.com', 'Colombo', 'Active', 'sup3', 'sup123');
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U4', 'Customer 1', 'cus1@gmail.com', 'Panadura', 'Active', 'cus1', 'cus123');
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U5', 'Customer 2', 'cus2@gmail.com', 'Moratuwa', 'Active', 'cus2', 'cus123');
INSERT INTO Users (UserID, Name, Email, Address, Status, Username, Password) VALUES ('U6', 'Admin 1', 'admin1@gmail.com', 'Bandaragama', 'Active', 'admin', 'admin123');

select * from USERS;


-- 2. ROLES
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (1, 'U4', 'Customer', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (2, 'U1', 'Supplier', 'Active');
INSERT INTO Roles (RoleID, UserID, RoleType, Status) VALUES (3, 'U6', 'Admin', 'Active');

select * from ROLES;

-- 3. CUSTOMERS (Format: CUS001, CUS002, etc.)
INSERT INTO Customers (CustomerID, UserID, PhoneNumber, DeliveryAddress) VALUES ('CUS001', 'U4', '078-777 0000', 'Welmilla');
INSERT INTO Customers (CustomerID, UserID, PhoneNumber, DeliveryAddress) VALUES ('CUS002', 'U5', '078-777 8888', 'Horowpathana');

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
VALUES (101, 'SUP001', 'Red Onions', 180.00, 'Vegetables', 100, 'Freshly harvested red onions', 'ACTIVE');

INSERT INTO Products (ProductID, SupplierID, ProductName, Price, ProductCategory, StockQuantity, Description, Status)
VALUES (102, 'SUP002', 'Basmati Rice', 220.00, 'Grains', 80, 'Organic Basmati Rice 1kg', 'ACTIVE');

INSERT INTO Products (ProductID, SupplierID, ProductName, Price, ProductCategory, StockQuantity, Description, Status)
VALUES (103, 'SUP003', 'Mangoes', 150.00, 'Fruits', 60, 'Sweet ripe mangoes', 'ACTIVE');

select * from Products;

-- 9. ORDERS
INSERT INTO Orders (OrderID, OrderDate, TotalAmount, Status, PaymentStatus, PaymentType, CustomerID) 
VALUES (1002, SYSDATE, 5000.00, 'Shipped', 'Completed', 'Credit Card', 'CUS001');

select * from Orders;

-- 10. ORDER DETAILS
INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, Quantity, SubTotal)
VALUES (1, 1002, 101, 10, 1800.00); -- Red Onions

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, Quantity, SubTotal)
VALUES (2, 1002, 102, 5, 1100.00); -- Basmati Rice

INSERT INTO Order_Details (OrderDetailID, OrderID, ProductID, Quantity, SubTotal)
VALUES (3, 1002, 103, 14, 2100.00); -- Mangoes

select * from Order_Details;

-- 11. PAYMENTS
INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (201, 1002, 'SUP001', 1800.00, SYSDATE, 'Completed', 'U4');

INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (202, 1002, 'SUP002', 1100.00, SYSDATE, 'Completed', 'U4');

INSERT INTO Payments (PaymentID, OrderID, SupplierID, Amount, PaymentDate, Status, UserID)
VALUES (203, 1002, 'SUP003', 2100.00, SYSDATE, 'Completed', 'U4');

select * from Payments;

-- 12. DELIVERIES
INSERT INTO Deliveries (DeliveryID, OrderID, EstimatedDate, DeliveryStatus, UserID)
VALUES (101, 1002, TO_DATE('2025-04-10', 'YYYY-MM-DD'), 'Pending', 'U1');

select * from Deliveries;
-----------------------------------------------------------------
-- TO DOUBLE CHECK IF THE DATA IS THERE IN TABLES
-----------------------------------------------------------------
SELECT * FROM Users;
SELECT * FROM Roles;
SELECT * FROM Customers;
SELECT * FROM Suppliers;
SELECT * FROM SystemAdmins;
SELECT * FROM Permissions;
SELECT * FROM Role_Permission;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM Order_Details;
SELECT * FROM Payments;
SELECT * FROM Deliveries;