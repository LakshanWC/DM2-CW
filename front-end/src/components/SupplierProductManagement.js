import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SupplierProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:8082/api/admin/products", {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                // Transform the keys to lowercase for consistent access
                const formattedProducts = response.data.map(product => ({
                    productId: product.PRODUCTID,
                    supplierId: product.SUPPIERID,
                    productName: product.PRODUCTNAME,
                    price: product.PRICE,
                    productCategory: product.PRODUCTCATEGORY,
                    stockQuantity: product.STOCKQUANTITY,
                    description: product.DESCRIPTION,
                    status: product.STATUS
                }));
                setProducts(formattedProducts);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (productId, newStatus) => {
        try {
            const response = await axios.post(
                `http://localhost:8082/api/admin/products/${productId}/status`,
                null,
                {
                    params: { newStatus },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.data && response.data.includes("Status updated")) {
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.productId === productId
                            ? { ...product, status: newStatus }
                            : product
                    )
                );
                setError(null);
            } else {
                throw new Error(response.data || "Update failed");
            }
        } catch (err) {
            console.error("Update error:", err);
            if (err.response?.data?.includes("Status updated")) {
                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.productId === productId
                            ? { ...product, status: newStatus }
                            : product
                    )
                );
                setError(null);
            } else {
                setError(`Update failed: ${err.response?.data || err.message}`);
            }
        }
    };

    if (loading) return <div style={styles.loading}>Loading products...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Supplier Product Management</h1>
            <button
                style={styles.backButton}
                onClick={() => navigate("/admin-dashboard")}
            >
                Back to Dashboard
            </button>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Product ID</th>
                        <th style={styles.tableHeader}>Supplier ID</th>
                        <th style={styles.tableHeader}>Product Name</th>
                        <th style={styles.tableHeader}>Price</th>
                        <th style={styles.tableHeader}>Category</th>
                        <th style={styles.tableHeader}>Stock</th>
                        <th style={styles.tableHeader}>Description</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.productId} style={styles.tableRow}>
                            <td style={styles.tableCell}>{product.productId}</td>
                            <td style={styles.tableCell}>{product.supplierId}</td>
                            <td style={styles.tableCell}>{product.productName}</td>
                            <td style={styles.tableCell}>{product.price}</td>
                            <td style={styles.tableCell}>{product.productCategory}</td>
                            <td style={styles.tableCell}>{product.stockQuantity}</td>
                            <td style={styles.tableCell}>{product.description}</td>
                            <td style={styles.tableCell}>
                                <select
                                    value={product.status}
                                    onChange={(e) => handleStatusChange(product.productId, e.target.value)}
                                    style={styles.statusSelect}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    title: {
        color: "#2c3e50",
        textAlign: "center",
        marginBottom: "30px"
    },
    backButton: {
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "20px",
        fontSize: "14px"
    },
    tableContainer: {
        overflowX: "auto",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        borderRadius: "8px"
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white"
    },
    tableHeaderRow: {
        backgroundColor: "#2c3e50",
        color: "white"
    },
    tableHeader: {
        padding: "12px 15px",
        textAlign: "left"
    },
    tableRow: {
        borderBottom: "1px solid #dddddd"
    },
    tableRowEven: {
        backgroundColor: "#f3f3f3"
    },
    tableCell: {
        padding: "12px 15px",
        textAlign: "left"
    },
    statusSelect: {
        padding: "6px 10px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        width: "100%"
    },
    loading: {
        textAlign: "center",
        padding: "20px",
        fontSize: "18px"
    },
    error: {
        textAlign: "center",
        padding: "20px",
        color: "red",
        fontSize: "18px"
    }
};

export default SupplierProductManagement;