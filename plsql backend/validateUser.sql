CREATE OR REPLACE FUNCTION validateUser (
    p_username IN VARCHAR2,
    p_password IN VARCHAR2,
    p_role     IN VARCHAR2
)
RETURN VARCHAR2
IS
    v_db_password VARCHAR2(255);
    v_status      VARCHAR2(20);
    v_userid      VARCHAR2(20);
    v_roletype    VARCHAR2(20);
BEGIN
    -- Fetch stored credentials and user role from USERS and ROLES tables
    BEGIN
        SELECT u.userID, u.password, r.roleType, u.status INTO v_userid, v_db_password, v_roletype, v_status
        FROM USERS u
        JOIN ROLES r ON u.userID = r.userID
        WHERE u.username = p_username;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Invalid user (not found)';
        WHEN TOO_MANY_ROWS THEN
            RETURN 'Invalid user (duplicate username)';
        WHEN OTHERS THEN
            RETURN 'Error: ' || SQLERRM;
    END;

    -- Validate role and status
    IF LOWER(p_role) != LOWER(v_roletype) THEN
        RETURN 'Role mismatch';
    ELSIF v_db_password = p_password AND v_status = 'Active' THEN
        RETURN 'Valid user|' || v_userid;
    ELSIF v_db_password = p_password THEN
        RETURN 'User exists but not active|' || v_userid;
    ELSE
        RETURN 'Invalid password';
    END IF;
END;

