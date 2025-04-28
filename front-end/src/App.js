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
import ResetPassword from "./components/ResetPassword";
import ItemPage from "./components/customer-components/ItemPage";
import OrderOverView from "./components/customer-components/OrderOverView";
import OrderHistory from "./components/customer-components/OrderHistory";
import OrderDelivery from "./components/customer-components/OrderDelivery";
import ReviewManagement from "./components/ReviewManagement";
import FeedbackManagement from "./components/FeedbackManagement";
import ItemCart from "./components/customer-components/ItemCart";
import OrdersPage from "./components/supplier-componets/pages/OrdersPage";

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
                            <Link to={
                                role === "admin" ? "/admin-dashboard" :
                                    role === "supplier" ? "/supplier/orders" : "/home"
                            } style={styles.navBrand}>
                                UrbanFood
                            </Link>
                            <div style={styles.navLinks}>
                                {role === "admin" ? (
                                    <>
                                        <NavButton to="/admin-dashboard" label="Dashboard" />
                                        <NavButton to="/admin/users" label="User Management" />
                                    </>
                                ) : role === "supplier" ? (

                                    <>
                                        {/* <NavButton to="/supplier/orders" label="DashBoard" />*/}
                                    </>
                                ) : (
                                    <>
                                        <NavButton to="/home" label="Dashboard" />
                                        {role === "customer" && <NavButton to="/marketplace" label="Marketplace" />}
                                        <NavButton to="/cart" label="Cart" />
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
                            (role === "admin" ? <Navigate to="/admin-dashboard" /> :
                                role === "supplier" ? <Navigate to="/supplier/orders" /> :
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

                    <Route path="/forgot-password" element={<ResetPassword />} />

                    {/* Customer routes */}
                    <Route
                        path="/*"
                        element={
                            isLoggedIn && role === "customer" ? (
                                <Routes>
                                    <Route path="/marketplace" element={<MarketPlace />} />
                                    <Route path="/item/:id" element={<ItemPage currentActiveUser={username} userID={userId}/>} />
                                    <Route path="/orders" element={<OrderOverView/>}/>
                                    <Route path="/history" element={<OrderHistory userId={userId}/>}/>
                                    <Route path="/deliveries" element={<OrderDelivery userId={userId}/>}/>
                                    <Route path="/cart" element={<ItemCart userId={userId}/>}/>
                                </Routes>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    {/* Supplier routes */}
                    <Route
                        path="/supplier/*"
                        element={
                            isLoggedIn && role === "supplier" ? (
                                <Routes>
                                    <Route path="/orders" element={<OrdersPage userId={userId} />} />
                                    {/* other supplier routes if any */}
                                </Routes>
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    <Route
                        path="/admin/reviews"
                        element={
                            isLoggedIn && role === "admin" ? (
                                <ReviewManagement />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />

                    <Route
                        path="/admin/feedbacks"
                        element={
                            isLoggedIn && role === "admin" ? (
                                <FeedbackManagement />
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