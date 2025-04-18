import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SupplierApproval() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get("http://localhost:8082/api/admin/suppliers", {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setSuppliers(response.data);
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

    const handleStatusChange = async (supplierId, newStatus) => {
        try {
            const response = await axios.post(
                `http://localhost:8082/api/admin/suppliers/${supplierId}/status`,
                null,
                {
                    params: { newStatus },
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            // Check if response contains success indication (more flexible matching)
            if (response.data && response.data.includes("Status updated")) {
                setSuppliers(prevSuppliers =>
                    prevSuppliers.map(supplier =>
                        supplier.supplierId === supplierId
                            ? { ...supplier, status: newStatus }
                            : supplier
                    )
                );
                setError(null); // Clear any errors
            } else {
                throw new Error(response.data || "Update failed");
            }
        } catch (err) {
            console.error("Update error:", err);
            // Show success message even if format wasn't exactly as expected
            if (err.response?.data?.includes("Status updated")) {
                setSuppliers(prevSuppliers =>
                    prevSuppliers.map(supplier =>
                        supplier.supplierId === supplierId
                            ? { ...supplier, status: newStatus }
                            : supplier
                    )
                );
                setError(null);
            } else {
                setError(`Update failed: ${err.response?.data || err.message}`);
            }
        }
    };

    if (loading) return <div style={styles.loading}>Loading suppliers...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Supplier Approval</h1>
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
                        <th style={styles.tableHeader}>Supplier ID</th>
                        <th style={styles.tableHeader}>Name</th>
                        <th style={styles.tableHeader}>Username</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Phone</th>
                        <th style={styles.tableHeader}>Address</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.supplierId} style={styles.tableRow}>
                            <td style={styles.tableCell}>{supplier.supplierId}</td>
                            <td style={styles.tableCell}>{supplier.name}</td>
                            <td style={styles.tableCell}>{supplier.username}</td>
                            <td style={styles.tableCell}>{supplier.email}</td>
                            <td style={styles.tableCell}>{supplier.phoneNumber}</td>
                            <td style={styles.tableCell}>{supplier.address}</td>
                            <td style={styles.tableCell}>
                                <select
                                    value={supplier.status}
                                    onChange={(e) => handleStatusChange(supplier.supplierId, e.target.value)}
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

export default SupplierApproval;