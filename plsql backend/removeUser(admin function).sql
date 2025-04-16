CREATE OR REPLACE FUNCTION remove_user_by_username(
    p_username IN VARCHAR2
) RETURN VARCHAR2 IS
    v_userid VARCHAR2(10);
    v_customerid VARCHAR2(10);
    v_supplierid VARCHAR2(10);
    v_adminid VARCHAR2(10);
    v_roleid NUMBER;
    v_result VARCHAR2(500);
BEGIN
    -- Get the UserID for the username
    SELECT UserID INTO v_userid
    FROM Users
    WHERE Username = p_username;
    
    -- Check if user is a customer and get CustomerID
    BEGIN
        SELECT CustomerID INTO v_customerid
        FROM Customers
        WHERE UserID = v_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_customerid := NULL;
    END;
    
    -- Check if user is a supplier and get SupplierID
    BEGIN
        SELECT SupplierID INTO v_supplierid
        FROM Suppliers
        WHERE UserID = v_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_supplierid := NULL;
    END;
    
    -- Check if user is an admin and get AdminID
    BEGIN
        SELECT AdminID INTO v_adminid
        FROM SystemAdmins
        WHERE UserID = v_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_adminid := NULL;
    END;
    
    -- Get RoleID if exists
    BEGIN
        SELECT RoleID INTO v_roleid
        FROM Roles
        WHERE UserID = v_userid;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_roleid := NULL;
    END;
    
    -- Start transaction
    SAVEPOINT before_delete;
    
    -- Delete from child tables first (in proper order)
    
    -- 1. Delete payments where user is referenced
    DELETE FROM Payments WHERE UserID = v_userid;
    
    -- 2. Delete deliveries where user is referenced
    DELETE FROM Deliveries WHERE UserID = v_userid;
    
    -- 3. If user is a customer, delete their orders and related data
    IF v_customerid IS NOT NULL THEN
        -- Delete order details for customer's orders
        DELETE FROM Order_Details 
        WHERE OrderID IN (SELECT OrderID FROM Orders WHERE CustomerID = v_customerid);
        
        -- Delete payments for customer's orders
        DELETE FROM Payments 
        WHERE OrderID IN (SELECT OrderID FROM Orders WHERE CustomerID = v_customerid);
        
        -- Delete deliveries for customer's orders
        DELETE FROM Deliveries 
        WHERE OrderID IN (SELECT OrderID FROM Orders WHERE CustomerID = v_customerid);
        
        -- Delete customer's orders
        DELETE FROM Orders WHERE CustomerID = v_customerid;
        
        -- Delete customer record
        DELETE FROM Customers WHERE CustomerID = v_customerid;
    END IF;
    
    -- 4. If user is a supplier, delete their products and related data
    IF v_supplierid IS NOT NULL THEN
        -- Delete order details for supplier's products
        DELETE FROM Order_Details 
        WHERE ProductID IN (SELECT ProductID FROM Products WHERE SupplierID = v_supplierid);
        
        -- Delete payments to supplier
        DELETE FROM Payments WHERE SupplierID = v_supplierid;
        
        -- Delete supplier's products
        DELETE FROM Products WHERE SupplierID = v_supplierid;
        
        -- Delete supplier record
        DELETE FROM Suppliers WHERE SupplierID = v_supplierid;
    END IF;
    
    -- 5. If user is an admin, delete admin record
    IF v_adminid IS NOT NULL THEN
        DELETE FROM SystemAdmins WHERE AdminID = v_adminid;
    END IF;
    
    -- 6. Delete role permissions if exists
    IF v_roleid IS NOT NULL THEN
        DELETE FROM Role_Permission WHERE RoleID = v_roleid;
        DELETE FROM Roles WHERE RoleID = v_roleid;
    END IF;
    
    -- Finally, delete the user
    DELETE FROM Users WHERE UserID = v_userid;
    
    COMMIT;
    v_result := 'User ' || p_username || ' and all related data successfully removed.';
    
    RETURN v_result;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK TO before_delete;
        RETURN 'User ' || p_username || ' not found. No action taken.';
    WHEN OTHERS THEN
        ROLLBACK TO before_delete;
        RETURN 'Error removing user ' || p_username || ': ' || SUBSTR(SQLERRM, 1, 200);
END remove_user_by_username;
/


DECLARE
    result VARCHAR2(500);
BEGIN
    result := remove_user_by_username('cus2');
    DBMS_OUTPUT.PUT_LINE(result);
END;
/