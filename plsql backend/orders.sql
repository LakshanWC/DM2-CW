set serveroutput on;
CREATE SEQUENCE payment_seq 
START WITH 204 
INCREMENT BY 1 
NOCACHE 
NOCYCLE;
-- 1. View new orders
CREATE OR REPLACE FUNCTION view_new_orders(
    p_supplier_id IN VARCHAR2
) RETURN SYS_REFCURSOR
AS
    v_cursor SYS_REFCURSOR;
BEGIN
    OPEN v_cursor FOR
        SELECT 
            o.OrderID, 
            o.OrderDate, 
            o.Status AS OrderStatus,
            p.ProductID, 
            p.ProductName,
            od.Quantity, 
            od.SubTotal, 
            od.OrderDetailID
        FROM Orders o
        JOIN Order_Details od ON o.OrderID = od.OrderID
        JOIN Products p ON od.ProductID = p.ProductID
        WHERE p.SupplierID = p_supplier_id
        AND o.Status = 'Pending'  -- Changed from od.Status to o.Status
        ORDER BY o.OrderDate DESC;
    
    RETURN v_cursor;
END;
/

-- 2. Accept order
CREATE OR REPLACE PROCEDURE accept_order(
    p_order_detail_id IN NUMBER,
    p_supplier_id IN VARCHAR2
) AS
    v_order_id NUMBER;
    v_product_id NUMBER;
    v_quantity NUMBER;
    v_count NUMBER;
BEGIN
    -- Verify the order detail exists and belongs to this supplier
    BEGIN
        SELECT od.OrderID, od.ProductID, od.Quantity
        INTO v_order_id, v_product_id, v_quantity
        FROM Order_Details od
        JOIN Products p ON od.ProductID = p.ProductID
        WHERE od.OrderDetailID = p_order_detail_id
        AND p.SupplierID = p_supplier_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20001, 'Order detail not found or not owned by supplier');
    END;
    
    -- Verify order is pending
    SELECT COUNT(*) INTO v_count
    FROM Orders
    WHERE OrderID = v_order_id
    AND Status = 'Pending';
    
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Order is not in Pending status');
    END IF;
    
    -- Update order status
    UPDATE Orders
    SET Status = 'Accepted'
    WHERE OrderID = v_order_id;
    
    -- Reduce stock
    --UPDATE Products
    --SET StockQuantity = StockQuantity - v_quantity
    --WHERE ProductID = v_product_id;
    
    COMMIT;
END;
/

-- 3. Reject order
CREATE OR REPLACE PROCEDURE cancelled_order(
    p_order_detail_id IN NUMBER,
    p_supplier_id IN VARCHAR2,
    p_reason IN VARCHAR2
) AS
    v_count NUMBER;
BEGIN
    -- Verify order item belongs to supplier
    SELECT COUNT(*) INTO v_count
    FROM Order_Details od
    JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderDetailID = p_order_detail_id
    AND p.SupplierID = p_supplier_id;
    
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'Order item not found or does not belong to supplier');
    END IF;
    
    -- Update the order status in Orders table
    UPDATE Orders o
    SET o.Status = 'Cancelled'  
    WHERE o.OrderID = (
        SELECT od.OrderID 
        FROM Order_Details od 
        WHERE od.OrderDetailID = p_order_detail_id
    );
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Order item ' || p_order_detail_id || ' cancelled successfully. Reason: ' || p_reason);
END;
/


-- 4. Update order status
CREATE OR REPLACE PROCEDURE update_order_status(
    p_order_id IN NUMBER,
    p_supplier_id IN VARCHAR2,
    p_new_status IN VARCHAR2
) AS
    v_valid NUMBER;
BEGIN
    -- Verify status is valid
    IF p_new_status NOT IN ('Pending', 'Shipped', 'Delivered', 'Cancelled') THEN
        RAISE_APPLICATION_ERROR(-20005, 'Invalid status provided');
    END IF;
    
    -- Verify supplier owns products in this order
    SELECT COUNT(*) INTO v_valid
    FROM Order_Details od
    JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderID = p_order_id
    AND p.SupplierID = p_supplier_id;
    
    IF v_valid = 0 THEN
        RAISE_APPLICATION_ERROR(-20006, 'Order not found or does not contain your products');
    END IF;
    
    -- Update status in Orders table (which we know has Status column)
    UPDATE Orders
    SET Status = p_new_status
    WHERE OrderID = p_order_id;
    
    COMMIT;
END;
/
CREATE OR REPLACE TRIGGER update_delivery_status
AFTER UPDATE OF STATUS ON ORDERS
FOR EACH ROW
DECLARE
    PRAGMA AUTONOMOUS_TRANSACTION; -- If you need separate transaction
BEGIN
    -- Only proceed if status actually changed
    IF :NEW.STATUS <> NVL(:OLD.STATUS, 'NULL') THEN
        -- Update with error handling
        BEGIN
            UPDATE DELIVERIES
            SET DELIVERYSTATUS = 
                CASE 
                    WHEN :NEW.STATUS = 'Accepted' THEN 'Accepted'
                    WHEN :NEW.STATUS = 'Shipped' THEN 'Shipped'
                    WHEN :NEW.STATUS = 'Delivered' THEN 'Delivered'
                    WHEN :NEW.STATUS = 'Cancelled' THEN 'Cancelled'
                    ELSE DELIVERYSTATUS -- No change for unknown statuses
                END
            WHERE ORDERID = :NEW.ORDERID;
            
            IF SQL%ROWCOUNT = 0 THEN
                DBMS_OUTPUT.PUT_LINE('Warning: No delivery record found for order ' || :NEW.ORDERID);
            END IF;
            
            COMMIT; -- Only needed with AUTONOMOUS_TRANSACTION
        EXCEPTION
            WHEN OTHERS THEN
                DBMS_OUTPUT.PUT_LINE('Error updating delivery: ' || SQLERRM);
                ROLLBACK; -- Only needed with AUTONOMOUS_TRANSACTION
        END;
    END IF;
END;
/

SELECT *FROM ORDERS;

SELECT name FROM v$services;

-- Create the user
CREATE USER supplier_user IDENTIFIED BY "passSupplier123!";

-- Grant basic connection privileges
GRANT CREATE SESSION TO supplier_user;

-- Grant privileges to work with the objects in your schema
GRANT SELECT, INSERT, UPDATE ON SYSTEM.Payments TO supplier_user;
GRANT SELECT, INSERT, UPDATE ON SYSTEM.Orders TO supplier_user;
GRANT SELECT, INSERT, UPDATE ON SYSTEM.Order_Details TO supplier_user;
GRANT SELECT, INSERT, UPDATE ON SYSTEM.Products TO supplier_user;
GRANT SELECT ON SYSTEM.Suppliers TO supplier_user;

-- Grant sequence privilege
GRANT SELECT ON payment_seq TO supplier_user;

-- Grant execute privileges on procedures and functions
GRANT EXECUTE ON SYSTEM.view_new_orders TO supplier_user;
GRANT EXECUTE ON SYSTEM.accept_order TO supplier_user;
GRANT EXECUTE ON SYSTEM.cancelled_order TO supplier_user;
GRANT EXECUTE ON SYSTEM.update_order_status TO supplier_user;
GRANT EXECUTE ON SYSTEM.addProduct TO supplier_user;

-- If you want the user to be able to see DBMS_OUTPUT messages
GRANT SELECT ON V_$SESSION TO supplier_user;

-- If you need to create synonyms for easier access
CREATE OR REPLACE PUBLIC SYNONYM supplier_orders FOR your_schema.Orders;
CREATE OR REPLACE PUBLIC SYNONYM supplier_order_details FOR your_schema.Order_Details;
-- (Repeat for other objects as needed)

CREATE OR REPLACE FUNCTION addProduct(
    p_supplierID       IN VARCHAR2,
    p_productName      IN VARCHAR2,
    p_price            IN NUMBER,
    p_productCategory  IN VARCHAR2,
    p_stockQuantity    IN NUMBER,
    p_description      IN VARCHAR2
) RETURN VARCHAR2
IS
    productId NUMBER;
    storedSupId VARCHAR2(30);
BEGIN
    -- Check if supplier exists
    BEGIN
        SELECT SUPPLIERID INTO storedSupId 
        FROM SUPPLIERS
        WHERE SUPPLIERID = p_supplierID;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Error: Supplier ID not found.';
    END;
    
    -- Get the next product ID
    SELECT NVL(MAX(PRODUCTID), 0) + 1 
    INTO productId 
    FROM PRODUCTS;
    
    -- Insert new product
    INSERT INTO PRODUCTS (
        PRODUCTID, SUPPLIERID, PRODUCTNAME, PRICE, PRODUCTCATEGORY, STOCKQUANTITY, DESCRIPTION
    )
    VALUES (
        productId, p_supplierID, p_productName, p_price, p_productCategory, p_stockQuantity, p_description
    );
    
    COMMIT;
    RETURN 'Product added successfully.';
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RETURN 'Error: ' || SQLERRM;
END;

select * from products;
delete from products where PRODUCTID = 107;
select * from orders;

SELECT table_name, constraint_name, search_condition 
FROM all_constraints 
WHERE constraint_name = 'SYS_C008489';

