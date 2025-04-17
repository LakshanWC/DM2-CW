import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ username }) {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate("/admin/users");
    };

    const handleProductManagement = () => {
        navigate("/admin/products");
    };

    const handleOrderManagement = () => {
        navigate("/admin/orders");
    };

    const handleReports = () => {
        navigate("/admin/reports");
    };

    return (
        <div style={styles.pageContainer}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Admin Dashboard</h1>
                <p style={styles.welcomeText}>Welcome, {username}</p>
            </header>

            {/* Main Content */}
            <main style={styles.mainContent}>
                <h2 style={styles.sectionTitle}>Management Panels</h2>

                <div style={styles.cardContainer}>
                    {/* User Management Card */}
                    <div style={styles.card} onClick={handleUserManagement}>
                        <div style={styles.cardIcon}>
                            <i className="fas fa-users" style={styles.icon}></i>
                        </div>
                        <h3 style={styles.cardTitle}>User Management</h3>
                        <p style={styles.cardText}>Manage all users, roles and permissions</p>
                    </div>

                    {/* Product Management Card */}
                    <div style={styles.card} onClick={handleProductManagement}>
                        <div style={styles.cardIcon}>
                            <i className="fas fa-boxes" style={styles.icon}></i>
                        </div>
                        <h3 style={styles.cardTitle}>Product Management</h3>
                        <p style={styles.cardText}>Manage products and categories</p>
                    </div>

                    {/* Order Management Card */}
                    <div style={styles.card} onClick={handleOrderManagement}>
                        <div style={styles.cardIcon}>
                            <i className="fas fa-clipboard-list" style={styles.icon}></i>
                        </div>
                        <h3 style={styles.cardTitle}>Order Management</h3>
                        <p style={styles.cardText}>View and manage all orders</p>
                    </div>

                    {/* Reports Card */}
                    <div style={styles.card} onClick={handleReports}>
                        <div style={styles.cardIcon}>
                            <i className="fas fa-chart-bar" style={styles.icon}></i>
                        </div>
                        <h3 style={styles.cardTitle}>Reports</h3>
                        <p style={styles.cardText}>View system reports and analytics</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 UrbanFood Admin Panel</p>
            </footer>
        </div>
    );
}

export default AdminDashboard;

const styles = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f7fa',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerTitle: {
        margin: 0,
        fontSize: '28px'
    },
    welcomeText: {
        margin: '5px 0 0',
        fontSize: '16px',
        opacity: 0.9
    },
    mainContent: {
        flex: 1,
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
    },
    sectionTitle: {
        color: '#2c3e50',
        fontSize: '24px',
        marginBottom: '30px',
        textAlign: 'center'
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textAlign: 'center',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }
    },
    cardIcon: {
        fontSize: '40px',
        color: '#3498db',
        marginBottom: '15px'
    },
    icon: {
        fontSize: '40px'
    },
    cardTitle: {
        color: '#2c3e50',
        margin: '10px 0',
        fontSize: '20px'
    },
    cardText: {
        color: '#7f8c8d',
        fontSize: '14px',
        lineHeight: '1.5'
    },
    footer: {
        backgroundColor: '#2c3e50',
        color: 'white',
        textAlign: 'center',
        padding: '15px',
        marginTop: 'auto'
    },
    footerText: {
        margin: 0,
        fontSize: '14px'
    }
};