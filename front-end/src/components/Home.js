import React from "react";

function Home({ username, role }) {
    return (
        <div style={styles.pageContainer}>
            {/* Hero Section */}
            <section style={styles.heroSection}>
                <div style={styles.heroText}>
                    <h1 style={styles.heroTitle}>Welcome to UrbanFood, {username}</h1>
                    <p style={styles.heroSubtitle}>Your go-to place for fresh, local food delivered to your door</p>
                    <button style={styles.heroButton}>Shop Now</button>
                </div>
            </section>

            {/* Featured Products */}
            <section style={styles.featuredSection}>
                <h2 style={styles.sectionTitle}>Featured Products</h2>
                <div style={styles.productsContainer}>
                    <div style={styles.productCard}>
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 1"
                            style={styles.productImage}
                        />
                        <h3 style={styles.productTitle}>Fresh Organic Tomatoes</h3>
                        <p style={styles.productPrice}>LKR 150</p>
                        <button style={styles.productButton}>Add to Cart</button>
                    </div>
                    <div style={styles.productCard}>
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 2"
                            style={styles.productImage}
                        />
                        <h3 style={styles.productTitle}>Local Green Apples</h3>
                        <p style={styles.productPrice}>LKR 200</p>
                        <button style={styles.productButton}>Add to Cart</button>
                    </div>
                    <div style={styles.productCard}>
                        <img
                            src="https://via.placeholder.com/200"
                            alt="Product 3"
                            style={styles.productImage}
                        />
                        <h3 style={styles.productTitle}>Fresh Carrots</h3>
                        <p style={styles.productPrice}>LKR 120</p>
                        <button style={styles.productButton}>Add to Cart</button>
                    </div>
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
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f7f6",
        color: "#333",
        padding: "0",
        margin: "0",
    },
    heroSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
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
    featuredSection: {
        padding: "40px 20px",
        textAlign: "center",
        backgroundColor: "#ffffff",
    },
    sectionTitle: {
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "30px",
    },
    productsContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "20px",
    },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
        width: "200px",
        padding: "15px",
        textAlign: "center",
    },
    productImage: {
        width: "100%",
        height: "auto",
        borderRadius: "8px",
    },
    productTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginTop: "15px",
    },
    productPrice: {
        fontSize: "16px",
        color: "#27ae60",
        margin: "10px 0",
    },
    productButton: {
        backgroundColor: "#f39c12",
        color: "white",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        fontSize: "14px",
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
