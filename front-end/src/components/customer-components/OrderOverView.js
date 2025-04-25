import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const OrderOverView = () => {
    const navigate = useNavigate(); // Initialize navigate function

    const cardStyle = {
        backgroundColor: "#ffffff",
        borderRadius: "1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "2rem",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
    };

    const iconStyle = {
        fontSize: "2.5rem",
        marginBottom: "1rem",
    };

    const containerStyle = {
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "2rem",
        width: "100%",
        maxWidth: "800px",
    };

    const headingStyle = {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "2rem",
    };

    // Add hover effect with inline event
    const handleMouseEnter = (e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    };

    const handleHistoryClick = () => {
        navigate("/history"); // Navigate to /history path when clicked
    };

    const handleDeliveryClick =() =>{
        navigate("/deliveries");
    }

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Order Overview</h1>
            <div style={gridStyle}>
                <div
                    style={cardStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleHistoryClick} // Add the onClick event handler
                >
                    <div style={iconStyle}>📜</div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>History</h2>
                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                        View all your past orders and purchases.
                    </p>
                </div>
                <div
                    style={cardStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleDeliveryClick}
                >
                    <div style={iconStyle}>🚚</div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Deliveries</h2>
                    <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                        Track your active and completed deliveries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderOverView;
