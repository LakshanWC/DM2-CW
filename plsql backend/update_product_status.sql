CREATE OR REPLACE FUNCTION update_product_status(
    p_product_id IN VARCHAR2,
    p_new_status IN VARCHAR2
) RETURN VARCHAR2
IS
BEGIN
    UPDATE Products
    SET status = p_new_status
    WHERE productid = p_product_id;
    
    IF SQL%ROWCOUNT = 0 THEN
        RETURN 'Error: Product not found';
    ELSE
        RETURN 'Status updated successfully';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error: ' || SQLERRM;
END;
/