import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ username, role }) {
    const navigate = useNavigate();

    const handleShopNowClick = () => {
        navigate("/marketplace");
    };

    return (
        <div style={styles.pageContainer}>
            {/* Hero Section - now fills all available space */}
            <section style={styles.heroSection}>
                <div style={styles.heroText}>
                    <h1 style={styles.heroTitle}>Welcome to UrbanFood, {username}</h1>
                    <p style={styles.heroSubtitle}>Your go-to place for fresh, local food delivered to your door</p>
                    <button style={styles.heroButton} onClick={handleShopNowClick}>Shop Now</button>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>© 2025 UrbanFood. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Home;

const styles = {
    pageContainer: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: "0",
    },
    heroSection: {
        flexGrow: 1, // This makes the hero section expand to fill available space
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #56ab2f, #a8e063)",
        color: "white",
        textAlign: "center",
    },
    heroText: {
        maxWidth: "600px",
    },
    heroTitle: {
        fontSize: "36px",
        fontWeight: "700",
        margin: "0",
    },
    heroSubtitle: {
        fontSize: "18px",
        margin: "20px 0",
    },
    heroButton: {
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "6px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    footer: {
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#2c3e50",
        color: "white",
    },
    footerText: {
        fontSize: "14px",
        margin: "0",
    },
};