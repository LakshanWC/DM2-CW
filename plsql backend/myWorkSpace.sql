---------------------------------
-- create a user to use by the customer-servce and user-service
---------------------------------

-- to use by user-service
CREATE USER user_service_user IDENTIFIED BY StrongPassword123;

GRANT CREATE SESSION TO user_service_user;
GRANT CONNECT TO user_service_user;
GRANT SELECT, INSERT, UPDATE ON SYSTEM.USERS TO user_service_user;
GRANT SELECT, INSERT ON SYSTEM.CUSTOMERS TO user_service_user;
GRANT SELECT, INSERT ON SYSTEM.SUPPLIERS TO user_service_user;
GRANT EXECUTE ON SYSTEM.validateUser TO user_service_user;
GRANT EXECUTE ON SYSTEM.createUser TO user_service_user;
GRANT EXECUTE ON SYSTEM.changePassword TO user_service_user;


---this user is used by customer-service
CREATE USER apiUser IDENTIFIED BY api123;
GRANT CONNECT, RESOURCE TO apiUser;
GRANT CREATE SESSION TO apiUser;

GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.USERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.ORDERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.SUPPLIERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.ORDER_DETAILS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.CUSTOMERS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.PAYMENTS TO apiUser;
GRANT SELECT, INSERT, UPDATE, DELETE ON SYSTEM.DELIVERIES TO apiUser;
GRANT SELECT, INSERT,UPDATE ON SYSTEM.PRODUCTS TO apiUser;

GRANT EXECUTE ON SYSTEM.SAVEORDER TO apiUser;
GRANT EXECUTE ON SYSTEM.GETDELIVERYORDERS TO apiUser;
GRANT EXECUTE ON SYSTEM.GETALLORDERS TO apiUser;
GRANT EXECUTE ON SYSTEM.GETALLDETAILS TO apiUser;
GRANT EXECUTE ON SYSTEM.GETALLPRODUCTS TO apiUser;
GRANT EXECUTE ON SYSTEM.addProduct TO apiUser;

GRANT EXECUTE ANY PROCEDURE TO APIUSER;



---------------------------------
    --user password reset
---------------------------------
CREATE OR REPLACE FUNCTION changePassword(u_userName in varchar2,new_password in varchar2)
RETURN VARCHAR2
AS
    qurry varchar2(2000);
    u_count number;
BEGIN
    SELECT COUNT(*) INTO u_count FROM USERS WHERE USERNAME = u_userName AND STATUS = 'Active';

    IF u_count =1 THEN 
    qurry := 'UPDATE USERS SET PASSWORD =:1 WHERE USERNAME =:2';
    EXECUTE IMMEDIATE qurry USING new_password,u_userName;
    RETURN 'Password Reset Successful';
    ELSE
        RETURN 'No active user found';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
    RETURN 'ERROR'||SQLERRM;
END;

--do invoke teset the fucntion
set serveroutput on;
BEGIN
   DBMS_OUTPUT.PUT_LINE(changePassword('lakshanwc', '12345678'));
END;

select * from users;
---------------------------------
    --user creation/registration-- -- function is for user service
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
    role_id  NUMBER;
    roleType VARCHAR(30);
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
        
        
         --add data to role tabel
        SELECT NVL(MAX(ROLEID), 0) INTO role_id FROM ROLES;
        role_id := role_id +1;
        
        roleType := 'Customer';
        status :='Active';
        
        qurry :='INSERT INTO ROLES(ROLEID,USERID,ROLETYPE,STATUS)
        VALUES(:1,:2,:3,:4)';
        EXECUTE IMMEDIATE qurry USING role_id,new_uid,roleType,status;
        

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
        
        --add data to role tabel
        SELECT NVL(MAX(ROLEID), 0) INTO role_id FROM ROLES;
        role_id := role_id +1;
        
        roleType := 'Supplier';
        status :='Active';
        
        qurry :='INSERT INTO ROLES(ROLEID,USERID,ROLETYPE,STATUS)
        VALUES(:1,:2,:3,:4)';
        EXECUTE IMMEDIATE qurry USING role_id,new_uid,roleType,status;
        

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
select * from deliveries;
select * from roles;


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
    p_deliverAddres  VARCHAR2,
    p_productjson    CLOB
) 
RETURN VARCHAR2
IS
    qurry         VARCHAR2(2000);
    total         NUMBER(10,2) := 0;
    orderID       NUMBER := 0;
    customerID    VARCHAR2(30);
    orderDetailID NUMBER := 0;
    supplierId    VARCHAR2(20);
    paymentId     NUMBER;
    p_stat        VARCHAR2(20);
    paymentCount  NUMBER;
    deliveryId    NUMBER;
    
BEGIN
    -- Generate new Order ID
    SELECT NVL(MAX(ORDERID), 0) + 1 INTO orderID FROM ORDERS;

    -- Get customer ID
    SELECT CUSTOMERID INTO customerID FROM CUSTOMERS WHERE USERID = p_userid;
    p_stat:='Completed';

    -- Insert blank order record first
    qurry := 'INSERT INTO ORDERS (ORDERID, ORDERDATE, TOTALAMOUNT, PAYMENTTYPE, CUSTOMERID,PaymentStatus) 
              VALUES (:1, :2, :3, :4, :5,:6)';
    EXECUTE IMMEDIATE qurry USING orderID, p_orderdate, total, p_paymenttype, customerID,p_stat;

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
        qurry := 'UPDATE PRODUCTS SET STOCKQUANTITY = STOCKQUANTITY - :1 WHERE ProductID = :2';
        EXECUTE IMMEDIATE qurry USING rec.quantity,rec.productid;
        
        
        
        --addPayment for each supplier who suppliy the item
        
        --generate new paymentId
        SELECT NVL(MAX(PAYMENTID), 0) INTO paymentId FROM PAYMENTS;
        paymentId := paymentId +1;
        
        --find supplier id for the current product
        SELECT SUPPLIERID INTO supplierId FROM PRODUCTS WHERE PRODUCTID =rec.productid;
        
        qurry := 'UPDATE Order_Details SET SupplierID =:1 WHERE ProductID =:2';
        EXECUTE IMMEDIATE qurry USING supplierId,rec.productid;
        
        --check if the details are there for this orderid + supplierId or not
        SELECT COUNT(*) INTO paymentCount FROM PAYMENTS WHERE ORDERID = orderID AND SUPPLIERID =supplierId ;
        
        IF p_paymenttype = 'Cash on Delivery (COD)' THEN
            p_stat :='Completed';
        ELSE
            p_stat :='Completed';
        END IF;
            
        IF paymentCount = 1 THEN 
            -- UPDATE PAYMENT DATA AS THE IT IS ALREADY THERE
            qurry :='UPDATE PAYMENTS SET AMOUNT = AMOUNT + :1 WHERE ORDERID =:2 AND SUPPLIERID =:3 ';
            EXECUTE IMMEDIATE qurry USING rec.subtotal,orderID,supplierId;
        
        ELSE
        --add the payment details AS ITS NOT HERE
        qurry:='INSERT INTO PAYMENTS(PAYMENTID,ORDERID,SUPPLIERID,AMOUNT,PAYMENTDATE,STATUS,USERID)
        VALUES(:1,:2,:3,:4,:5,:6,:7)';  
        EXECUTE IMMEDIATE qurry USING paymentId,orderID,supplierId,rec.subtotal,p_orderdate,p_stat,p_userid ;
        
        END IF;

        total := total + rec.subtotal;
    END LOOP;

    -- Update order total
    qurry := 'UPDATE ORDERS SET TOTALAMOUNT = :1 WHERE ORDERID = :2';
    EXECUTE IMMEDIATE qurry USING total, orderID;
    
    --add data to deliveries table
     SELECT NVL(MAX(DELIVERYID), 0) INTO deliveryId FROM DELIVERIES;
        deliveryId := deliveryId +1;
        
        qurry :='INSERT INTO DELIVERIES (DELIVERYID,ORDERID,ESTIMATEDDATE,USERID,DELIVERYADDRESS)
        VALUES (:1,:2,SYSDATE + 5,:3,:4)';
        EXECUTE IMMEDIATE qurry USING deliveryId,orderID,p_userid,p_deliverAddres;

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
    p_deliverAddres  VARCHAR2(200) := '123 Main Street, Colombo'; -- Updated delivery address
    p_productjson    CLOB := '{"products":[{"productId":"103","quantity":2,"subtotal":300.0}]}';

    -- Output variable
    result VARCHAR2(200);
BEGIN
    -- Call the saveOrder function
    result := saveOrder(p_orderdate, p_paymenttype, p_userid, p_deliverAddres, p_productjson);

    -- Output the result of the function
    DBMS_OUTPUT.PUT_LINE(result);
END;


--- quick accss

select * from USERS;
select * from ORDERS;
select * from ORDER_DETAILS;
select * from deliveries;
select * from SUPPLIERS;
select * from CUSTOMERS;
select * from PRODUCTS;
select * from payments;

delete from ORDERS WHERE ORDERID = 1003;
delete from deliveries where DELIVERYID =103;
delete from ORDER_DETAILS WHERE ORDERID =1004;
delete from PAYMENTS where ORDERID =1004;

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



select * from deliveries;


------------------------------------
    --view all orders for given user
------------------------------------
CREATE OR REPLACE FUNCTION getAllOrders(
    t_userID IN VARCHAR2
) RETURN SYS_REFCURSOR
AS
    result_cursor SYS_REFCURSOR;
    v_customer_id VARCHAR2(30);
BEGIN
    -- Get the customer ID 
    BEGIN
        SELECT CUSTOMERID INTO v_customer_id 
        FROM CUSTOMERS 
        WHERE USERID = t_userID;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL; 
    END;
    
    -- Get orders this specifc customer
    OPEN result_cursor FOR
        SELECT * FROM ORDERS
        WHERE CUSTOMERID = v_customer_id;
    
    RETURN result_cursor;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;

select * from users;
select * from customers;
select * from orders;





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


select * from products;
















