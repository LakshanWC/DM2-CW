set serveroutput on;

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
            o.PaymentStatus,
            o.Cancellation_Reason,
            p.ProductID, 
            p.ProductName,
            od.Quantity, 
            od.SubTotal, 
            od.OrderDetailID,
            p.SupplierID  -- Make sure to include SupplierID in the result
        FROM Orders o
        JOIN Order_Details od ON o.OrderID = od.OrderID
        JOIN Products p ON od.ProductID = p.ProductID
        WHERE p.SupplierID = p_supplier_id  -- Strict filter by supplier
        ORDER BY o.OrderDate DESC;
    
    RETURN v_cursor;
END;
/

-- 2. Accept order (modified version)
CREATE OR REPLACE PROCEDURE accept_order(
    p_order_detail_id IN NUMBER,
    p_supplier_id IN VARCHAR2
) AS
    v_order_id NUMBER;
    v_payment_status VARCHAR2(20);
    v_order_status VARCHAR2(20);
BEGIN
    -- Get order and payment status
    SELECT o.OrderID, o.PaymentStatus, o.Status
    INTO v_order_id, v_payment_status, v_order_status
    FROM Orders o
    JOIN Order_Details od ON o.OrderID = od.OrderID
    JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderDetailID = p_order_detail_id
    AND p.SupplierID = p_supplier_id;
    
    -- Verify payment and order status
    IF v_payment_status NOT IN ('Pending', 'Completed') THEN
        RAISE_APPLICATION_ERROR(-20001, 'Can only accept orders with Pending or Completed payment');
    END IF;
    
    IF v_order_status != 'Pending' THEN
        RAISE_APPLICATION_ERROR(-20002, 'Order is not in Pending status');
    END IF;
    
    -- Update order status
    UPDATE Orders
    SET Status = 'Accepted'
    WHERE OrderID = v_order_id;
    
    COMMIT;
END;
/

-- 3. Cancel order (modified version)
CREATE OR REPLACE PROCEDURE cancelled_order(
    p_order_detail_id IN NUMBER,
    p_supplier_id IN VARCHAR2,
    p_reason IN VARCHAR2
) AS
    v_order_id NUMBER;
    v_payment_status VARCHAR2(20);
    v_order_status VARCHAR2(20);
BEGIN
    -- Get order and payment status
    SELECT o.OrderID, o.PaymentStatus, o.Status
    INTO v_order_id, v_payment_status, v_order_status
    FROM Orders o
    JOIN Order_Details od ON o.OrderID = od.OrderID
    JOIN Products p ON od.ProductID = p.ProductID
    WHERE od.OrderDetailID = p_order_detail_id
    AND p.SupplierID = p_supplier_id;
    
    -- Verify cancellation is allowed
    IF v_payment_status NOT IN ('Failed', 'Refunded') AND v_order_status != 'Pending' THEN
        RAISE_APPLICATION_ERROR(-20003, 'Can only cancel Pending orders or Failed/Refunded payments');
    END IF;
    
    -- Update order status and reason
    UPDATE Orders
    SET Status = 'Cancelled',
        Cancellation_Reason = p_reason
    WHERE OrderID = v_order_id;
    
    COMMIT;
END;
/
DROP TRIGGER update_delivery_status;


-- 4. Update order status
CREATE OR REPLACE TRIGGER update_delivery_status
AFTER UPDATE OF STATUS ON ORDERS
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.STATUS <> NVL(:OLD.STATUS, 'NULL') THEN
        UPDATE DELIVERIES
        SET                     ``1 a   
         /
         vbbvb
            DELIVERYSTATUS = CASE 
                                WHEN :NEW.STATUS = 'Accepted' THEN 'Accepted'
                                WHEN :NEW.STATUS = 'Shipped' THEN 'Shipped'
                                WHEN :NEW.STATUS = 'Delivered' THEN 'Delivered'
                                WHEN :NEW.STATUS = 'Cancelled' THEN 'Cancelled'
                                ELSE DELIVERYSTATUS
                             END,
            DELIVEREDDATE = CASE 
                                WHEN :NEW.STATUS = 'Delivered' THEN SYSDATE
                                ELSE DELIVEREDDATE
                            END
        WHERE ORDERID = :NEW.ORDERID;
    END IF;
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

