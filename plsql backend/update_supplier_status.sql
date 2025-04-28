CREATE OR REPLACE FUNCTION update_supplier_status(
    p_supplier_id IN VARCHAR2,
    p_new_status IN VARCHAR2
) RETURN VARCHAR2 IS
    v_user_id VARCHAR2(10);
    v_count NUMBER;
    v_result VARCHAR2(200);
BEGIN
    -- Validate the new status value
    IF p_new_status NOT IN ('ACTIVE', 'INACTIVE') THEN
        RETURN 'Error: Invalid status. Must be ACTIVE or INACTIVE';
    END IF;
    
    -- Check if supplier exists
    BEGIN
        SELECT USERID INTO v_user_id
        FROM SUPPLIERS
        WHERE SUPPLIERID = p_supplier_id;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'Error: Supplier not found with ID: ' || p_supplier_id;
    END;
    
    -- Verify the user exists
    SELECT COUNT(*) INTO v_count
    FROM USERS
    WHERE USERID = v_user_id;
    
    IF v_count = 0 THEN
        RETURN 'Error: Associated user not found for supplier';
    END IF;
    
    -- Start transaction
    SAVEPOINT before_update;
    
    BEGIN
        -- Update SUPPLIERS table
        UPDATE SUPPLIERS
        SET STATUS = p_new_status
        WHERE SUPPLIERID = p_supplier_id;
        
        -- Update USERS table
        UPDATE USERS
        SET STATUS = p_new_status
        WHERE USERID = v_user_id;
        
        COMMIT;
        v_result := 'Success: Status updated to ' || p_new_status || 
                   ' for supplier ' || p_supplier_id || 
                   ' and associated user';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK TO before_update;
            v_result := 'Error updating status: ' || SUBSTR(SQLERRM, 1, 200);
    END;
    
    RETURN v_result;
END update_supplier_status;
