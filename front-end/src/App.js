import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/customer-components/Home";
import AdminDashboard from "./components/AdminDashboard";
import UserManagement from "./components/UserManagement";
import SupplierApproval from "./components/SupplierApproval";
import PaymentHistory from "./components/PaymentHistory";
import SupplierProductManagement from "./components/SupplierProductManagement";
import MarketPlace from "./components/customer-components/MarketPlace";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("user");
    const [userId, setUserId] = useState("");

    const handleLogin = (user, loggedIn, userRole, userIdFromBackend) => {
        setCurrentUser(user);
        setIsLoggedIn(loggedIn);
        setRole(userRole);
        setUserId(userIdFromBackend);
        if (loggedIn) setUsername(user);
    };


    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("");
        setRole("user");
    };

    return (
        <div style={styles.app}>
            <Router>
                {isLoggedIn && (
                    <nav style={styles.navbar}>
                        <div style={styles.navContainer}>
                            <Link to={role === "admin" ? "/admin-dashboard" : "/home"} style={styles.navBrand}>
                                UrbanFood
                            </Link>
                            <div style={styles.navLinks}>
                                {role === "admin" ? (
                                    <>
                                        <NavButton to="/admin-dashboard" label="Dashboard" />
                                        <NavButton to="/admin/users" label="User Management" />
                                    </>
                                ) : (
                                    <>
                                        <NavButton to="/home" label="Dashboard" />
                                        {role === "suppliers" && <NavButton to="/my-products" label="My Products" />}


                                        
                                        {role === "customer" && <NavButton to="/marketplace" label="Marketplace" />}
                                        <NavButton to="/account" label="My Account" />
                                        <NavButton to="/orders" label="My Orders" />
                                    </>
                                )}
                            </div>
                            <button onClick={handleLogout} style={{ ...styles.navButton, ...styles.logoutButton }}>
                                Logout
                            </button>
                        </div>
                    </nav>
                )}

                <Routes>
                    <Route
                        path="/"
                        element={isLoggedIn ?
                            (role === "admin" ?
                                <Navigate to="/admin-dashboard" /> :
                                <Navigate to="/home" />) :
                            <Login handleLogin={handleLogin} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/home"
                        element={isLoggedIn ? <Home username={username} role={role} /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/admin-dashboard"
                        element={isLoggedIn && role === "admin" ?
                            <AdminDashboard username={username} /> :
                            <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/users"
                        element={isLoggedIn && role === "admin" ?
                            <UserManagement /> :
                            <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/suppliers"
                        element={isLoggedIn && role === "admin" ?
                            <SupplierApproval /> :
                            <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/payments"
                        element={isLoggedIn && role === "admin" ?
                            <PaymentHistory /> :
                            <Navigate to="/" />}
                    />
                    <Route
                        path="/admin/orders"
                        element={isLoggedIn && role === "admin" ?
                            <SupplierProductManagement /> :
                            <Navigate to="/" />}
                    />


                    {/*customer part*/}
                    <Route
                        path="/*"
                        element={
                            isLoggedIn && role === "customer" ? (
                                <Routes>
                                    <Route path="/marketplace" element={<MarketPlace />} />
                                </Routes>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

const NavButton = ({ to, label }) => (
    <Link to={to} style={styles.navLink}>
        <button style={styles.navButton}>{label}</button>
    </Link>
);

export default App;

const styles = {
    app: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    },
    navbar: {
        backgroundColor: "#2c3e50",
        padding: "0.5rem 1rem",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
    },
    navContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
    },
    navBrand: {
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "700",
        textDecoration: "none"
    },
    navLinks: {
        display: "flex",
        gap: "1rem"
    },
    navLink: {
        textDecoration: "none"
    },
    navButton: {
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    },
    logoutButton: {
        backgroundColor: "#e74c3c"
    },
    "@media (max-width: 768px)": {
        navContainer: {
            flexDirection: "column",
            gap: "1rem"
        },
        navLinks: {
            flexWrap: "wrap",
            justifyContent: "center"
        }
    }
};