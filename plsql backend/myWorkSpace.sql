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
BEGIN
    -- Check if username already exists
    SELECT COUNT(*) INTO u_result FROM USERS WHERE USERNAME = u_userName;

    IF u_result > 0 THEN
        message := 'Username already exists';
        RETURN;
    END IF;

    SELECT COUNT(*) INTO u_result FROM USERS;
    new_uid := 'U' || TO_CHAR(u_result + 1);

    qurry := 'INSERT INTO USERS(USERID, NAME, EMAIL, ADDRESS, USERNAME, PASSWORD) 
              VALUES(:1, :2, :3, :4, :5, :6)';
    EXECUTE IMMEDIATE qurry USING new_uid, u_name, u_email, u_address, u_userName, u_password;

    IF u_role = 1 THEN
        SELECT COUNT(*) INTO count_val FROM CUSTOMERS;
        new_id := 'CUS' || TO_CHAR(count_val + 1);

        qurry := 'INSERT INTO CUSTOMERS(CUSTOMERID, USERID, PHONENUMBER, DELIVERYADDRESS) 
                  VALUES(:1, :2, :3, :4)';
        EXECUTE IMMEDIATE qurry USING new_id, new_uid, u_phoneNo, u_address;

    ELSIF u_role = 2 THEN
        SELECT COUNT(*) INTO count_val FROM SUPPLIERS;
        new_id := 'SUP' || TO_CHAR(count_val + 1);

        qurry := 'INSERT INTO SUPPLIERS(SUPPLIERID, USERID, PHONENUMBER, ADDRESS) 
                  VALUES(:1, :2, :3, :4)';
        EXECUTE IMMEDIATE qurry USING new_id, new_uid, u_phoneNo, u_address;
    END IF;

    COMMIT;
    message := 'Registration successful';

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        message := 'Error: ' || SQLERRM;
END;






