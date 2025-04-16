CREATE OR REPLACE FUNCTION validateUser (
    p_username IN VARCHAR2,
    p_password IN VARCHAR2,
    p_role     IN VARCHAR2
)
RETURN VARCHAR2
IS
    v_db_password VARCHAR2(255);
    v_status      VARCHAR2(20);
    v_db_role     VARCHAR2(50) := 'admin'; -- Predefined role
BEGIN
    -- Check if the role matches the predefined role
    IF p_role != v_db_role THEN
        RETURN 'Invalid role';
    END IF;

    -- Get the stored credentials
    BEGIN
        SELECT password, status INTO v_db_password, v_status
        FROM USERS 
        WHERE username = p_username;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Invalid user (not found)';
        WHEN TOO_MANY_ROWS THEN
            RETURN 'Invalid user (duplicate username)';
        WHEN OTHERS THEN
            RETURN 'Error: ' || SQLERRM;
    END;

    -- Perform exact comparison
    IF v_db_password = p_password AND v_status = 'Active' THEN
        RETURN 'Valid user';
    ELSIF v_db_password = p_password THEN
        RETURN 'User exists but not active';
    ELSE
        RETURN 'Invalid password';
    END IF;
END;
/


/
