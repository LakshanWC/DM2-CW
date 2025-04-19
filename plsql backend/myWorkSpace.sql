---------------------------------
-- create a user to use by the api
---------------------------------

CREATE USER apiUser IDENTIFIED BY api123;
GRANT CONNECT, RESOURCE TO apiUser;

GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.USERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.ORDERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.SUPPLIERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.ORDER_DETAILS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.CUSTOMERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.PAYMENTS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.DELIVERIES TO apiUser;
GRANT EXECUTE ON SYSTEM.SAVEORDER TO apiUser;
GRANT EXECUTE ON SYSTEM.GETDELIVERYORDERS TO apiUser;
GRANT EXECUTE ON SYSTEM.GETALLORDERS TO apiUser;
GRANT EXECUTE ON SYSTEM.GETALLDETAILS TO apiUser;
GRANT EXECUTE ANY PROCEDURE TO APIUSER;


---------------------------------
    --user creation/registration--
---------------------------------

CREATE OR REPLACE PROCEDURE createUser(
    u_name     IN VARCHAR2,
    u_email    IN VARCHAR2,
    u_address  IN VARCHAR2,
    u_userName IN VARCHAR2,
    u_password IN VARCHAR2,
    u_phoneNo  IN VARCHAR2,
    u_role     IN NUMBER,          -- 1 for customer, 2 for supplier
    message    OUT VARCHAR2
)
AS
    u_result NUMBER;
    new_uid  VARCHAR2(20);
    new_id   VARCHAR2(20);
    count_val NUMBER;
    qurry    VARCHAR2(2000);
    status   VARCHAR2(20);
BEGIN
    -- Check if username already exists
    SELECT COUNT(*) INTO u_result FROM USERS WHERE USERNAME = u_userName;

    IF u_result > 0 THEN
        message := 'Username already exists';
        RETURN;
    END IF;

    -- Generate a new user ID
    SELECT COUNT(*) INTO u_result FROM USERS;
    new_uid := 'U' || TO_CHAR(u_result + 1);

    -- Customer Creation
    IF u_role = 1 THEN
        status := 'Active';
        qurry := 'INSERT INTO USERS(USERID, NAME, EMAIL, ADDRESS, STATUS, USERNAME, PASSWORD) 
                  VALUES(:1, :2, :3, :4, :5, :6, :7)';
        EXECUTE IMMEDIATE qurry USING new_uid, u_name, u_email, u_address, status, u_userName, u_password;
    
        -- Create Customer record
        SELECT COUNT(*) INTO count_val FROM CUSTOMERS;
        new_id := 'CUS' || TO_CHAR(count_val + 1);

        qurry := 'INSERT INTO CUSTOMERS(CUSTOMERID, USERID, PHONENUMBER, DELIVERYADDRESS) 
                  VALUES(:1, :2, :3, :4)';
        EXECUTE IMMEDIATE qurry USING new_id, new_uid, u_phoneNo, u_address;

        message := 'Registration successful';

    -- Supplier Creation (Inactive until Admin Activation)
    ELSIF u_role = 2 THEN
        status := 'Inactive';
        qurry := 'INSERT INTO USERS(USERID, NAME, EMAIL, ADDRESS, STATUS, USERNAME, PASSWORD) 
                  VALUES(:1, :2, :3, :4, :5, :6, :7)';
        EXECUTE IMMEDIATE qurry USING new_uid, u_name, u_email, u_address, status, u_userName, u_password;
    
        -- Create Supplier record
        SELECT COUNT(*) INTO count_val FROM SUPPLIERS;
        new_id := 'SUP' || TO_CHAR(count_val + 1);

        qurry := 'INSERT INTO SUPPLIERS(SUPPLIERID, USERID, PHONENUMBER, ADDRESS, STATUS) 
                  VALUES(:1, :2, :3, :4, :5)';
        EXECUTE IMMEDIATE qurry USING new_id, new_uid, u_phoneNo, u_address, status;

        message := 'Registration successful, your account will be activated by the admin after review';
    END IF;

    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        message := 'Error: ' || SQLERRM;
END;





select * from users;
select * from customers;
select * from suppliers;

delete from users where USERID ='U7';
commit;
-----------------------------------------
    --get all products
----------------------------------------

CREATE OR REPLACE FUNCTION getAllProducts(
    p_category IN VARCHAR2,
    p_price IN NUMBER
) RETURN SYS_REFCURSOR
IS
    all_product SYS_REFCURSOR;
    v_sql       VARCHAR2(1000);
BEGIN
    -- Always include STATUS = 'ACTIVE'
    v_sql := 'SELECT * FROM products WHERE STATUS = ''ACTIVE''';

    IF p_category IS NOT NULL THEN
        v_sql := v_sql || ' AND PRODUCTCATEGORY = :cat';
    END IF;

    IF p_price IS NOT NULL THEN
        v_sql := v_sql || ' AND PRICE <= :price';  -- Updated to <= for max price
    END IF;

    IF p_category IS NOT NULL AND p_price IS NOT NULL THEN
        OPEN all_product FOR v_sql USING p_category, p_price;
    ELSIF p_category IS NOT NULL THEN
        OPEN all_product FOR v_sql USING p_category;
    ELSIF p_price IS NOT NULL THEN
        OPEN all_product FOR v_sql USING p_price;
    ELSE
        OPEN all_product FOR 'SELECT * FROM products WHERE STATUS = ''ACTIVE''';
    END IF;

    RETURN all_product;
END;




select * from products;

----------------------------------------
--make an order
----------------------------------------

CREATE OR REPLACE FUNCTION saveOrder( 
    p_orderdate      DATE,
    p_paymenttype    VARCHAR2,
    p_userid         VARCHAR2,
    p_productjson    CLOB
) 
RETURN VARCHAR2
IS
    qurry         VARCHAR2(2000);
    total         NUMBER(10,2) := 0;
    orderID       NUMBER := 0;
    customerID    VARCHAR2(30);
    orderDetailID NUMBER := 0;
BEGIN
    -- Generate new Order ID
    SELECT NVL(MAX(ORDERID), 0) + 1 INTO orderID FROM ORDERS;

    -- Get customer ID
    SELECT CUSTOMERID INTO customerID FROM CUSTOMERS WHERE USERID = p_userid;

    -- Insert blank order record first
    qurry := 'INSERT INTO ORDERS (ORDERID, ORDERDATE, TOTALAMOUNT, PAYMENTTYPE, CUSTOMERID) 
              VALUES (:1, :2, :3, :4, :5)';
    EXECUTE IMMEDIATE qurry USING orderID, p_orderdate, total, p_paymenttype, customerID;

    -- Get last ORDERDETAILID
    SELECT NVL(MAX(ORDERDETAILID), 0) INTO orderDetailID FROM ORDER_DETAILS;

    -- Use JSON_TABLE to loop through parsed products
    FOR rec IN (
        SELECT *
        FROM JSON_TABLE(
            p_productjson,
            '$[*]' COLUMNS (
            productid  VARCHAR2(50) PATH '$.productId',
            quantity   NUMBER       PATH '$.quantity',
            subtotal   NUMBER       PATH '$.subtotal'
            )
        )
    ) LOOP
        orderDetailID := orderDetailID + 1;

        -- for debuging
        DBMS_OUTPUT.PUT_LINE('Inserting Product: ' || rec.productid || ', Quantity: ' || rec.quantity || ', Subtotal: ' || rec.subtotal);

        -- Insert into ORDER_DETAILS
        qurry := 'INSERT INTO ORDER_DETAILS (ORDERDETAILID, ORDERID, PRODUCTID, QUANTITY, SUBTOTAL)
                  VALUES (:1, :2, :3, :4, :5)';
        EXECUTE IMMEDIATE qurry USING orderDetailID, orderID, rec.productid, rec.quantity, rec.subtotal;
        
        --deduct that much quantity from the stock
        qurry := 'UPDATE PRODUCTS SET STOCKQUANTITY = STOCKQUANTITY - :1 WHERE PRODUCTID =:2';
        EXECUTE IMMEDIATE qurry USING rec.quantity,rec.productid;

        total := total + rec.subtotal;
    END LOOP;

    -- Update order total
    qurry := 'UPDATE ORDERS SET TOTALAMOUNT = :1 WHERE ORDERID = :2';
    EXECUTE IMMEDIATE qurry USING total, orderID;

    COMMIT;
    RETURN 'Order added successfully';

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RETURN 'Error: ' || SQLERRM;
END;


--- for manualy  invok the function
set serveroutput on;
DECLARE
    -- Input values
    p_orderdate      DATE := TO_DATE('2025-04-18', 'YYYY-MM-DD');
    p_paymenttype    VARCHAR2(20) := 'Credit Card';
    p_userid         VARCHAR2(30) := 'U5';
    p_productjson    CLOB := '{"products":[{"productId":"103","quantity":2,"subtotal":300.0}]}';

    -- Output variable
    result VARCHAR2(200);
BEGIN
    -- Call the saveOrder function
    result := saveOrder(p_orderdate, p_paymenttype, p_userid, p_productjson);

    -- Output the result of the function
    DBMS_OUTPUT.PUT_LINE(result);
END;


--- quick accss

select * from USERS;
select * from ORDERS;
select * from ORDER_DETAILS;
select * from SUPPLIERS;
select * from CUSTOMERS;
select * from PRODUCTS;

delete from ORDERS WHERE ORDERID = 1003;

--------------------------------------
--make payment
--------------------------------------
--------------------------------------
-- track order
--------------------------------------

select * from Deliveries;


CREATE OR REPLACE FUNCTION getDeliveryOrders(
    t_userID  IN VARCHAR2
) RETURN SYS_REFCURSOR
AS
    result_cursor  SYS_REFCURSOR;
BEGIN
    
        OPEN result_cursor FOR
        SELECT * FROM Deliveries
        WHERE USERID = t_userID;

    RETURN result_cursor;

EXCEPTION
    WHEN OTHERS THEN
        -- Return empty result set on any error
        OPEN result_cursor FOR
        SELECT * FROM Deliveries WHERE 1 = 0;
        RETURN result_cursor;
END;

------------------------------------
    --view all orders for given user
------------------------------------

CREATE OR REPLACE FUNCTION getAllOrders(
    t_userID  IN VARCHAR2
) RETURN SYS_REFCURSOR
AS
    result_cursor  SYS_REFCURSOR;
    customerId VARCHAR2(30);
BEGIN
    SELECT CUSTOMERID INTO customerId FROM USERS WHERE USERID = t_userID;

    OPEN result_cursor FOR
        SELECT * FROM ORDERS
        WHERE CUSTOMERID = customerId;

    RETURN result_cursor;

EXCEPTION
    WHEN OTHERS THEN
        OPEN result_cursor FOR SELECT * FROM ORDERS WHERE 1 = 0;
        RETURN result_cursor;
END;




CREATE OR REPLACE FUNCTION getAllDetails(
    t_orderID  IN VARCHAR2
) RETURN SYS_REFCURSOR
AS
    result_cursor  SYS_REFCURSOR;
BEGIN
    
        OPEN result_cursor FOR
        SELECT * FROM ORDER_DETAILS
        WHERE ORDERID = t_orderID;

    RETURN result_cursor;

EXCEPTION
    WHEN OTHERS THEN
        OPEN result_cursor FOR
        SELECT * FROM ORDER_DETAILS WHERE 1 = 0;
        RETURN result_cursor;
END;



















