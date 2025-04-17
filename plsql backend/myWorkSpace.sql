---------------------------------
    --user creation--
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

