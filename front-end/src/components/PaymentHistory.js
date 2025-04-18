import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaymentHistory() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get('http://localhost:8082/api/admin/payments', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setPayments(response.data);
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

        fetchPayments();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <div style={styles.loading}>Loading payment history...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment History</h1>
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
                        <th style={styles.tableHeader}>Payment ID</th>
                        <th style={styles.tableHeader}>Order ID</th>
                        <th style={styles.tableHeader}>Supplier ID</th>
                        <th style={styles.tableHeader}>User ID</th>
                        <th style={styles.tableHeader}>Amount</th>
                        <th style={styles.tableHeader}>Date</th>
                        <th style={styles.tableHeader}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.PAYMENTID} style={styles.tableRow}>
                            <td style={styles.tableCell}>{payment.PAYMENTID}</td>
                            <td style={styles.tableCell}>{payment.ORDERID}</td>
                            <td style={styles.tableCell}>{payment.SUPPLIERID}</td>
                            <td style={styles.tableCell}>{payment.USERID}</td>
                            <td style={styles.tableCell}>Rs. {payment.AMOUNT?.toFixed(2)}</td>
                            <td style={styles.tableCell}>{formatDate(payment.PAYMENTDATE)}</td>
                            <td style={styles.tableCell}>
                                    <span style={getStatusStyle(payment.STATUS)}>
                                        {payment.STATUS}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED':
            return { color: 'green', fontWeight: 'bold' };
        case 'PENDING':
            return { color: 'orange', fontWeight: 'bold' };
        case 'FAILED':
            return { color: 'red', fontWeight: 'bold' };
        default:
            return {};
    }
};

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
    tableCell: {
        padding: "12px 15px",
        textAlign: "left"
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

export default PaymentHistory;