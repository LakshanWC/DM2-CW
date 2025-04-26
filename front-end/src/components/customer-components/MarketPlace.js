import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8082/products')
            .then(response => {
                const activeProducts = response.data.filter(p => p.status === 'ACTIVE');
                setProducts(activeProducts);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div style={styles.pageContainer}>
            <div style={styles.featuredSection}>
                <h1 style={styles.sectionTitle}>Fresh From the Farm</h1>
                <div style={styles.productsContainer}>
                    {products.map(product => (
                        <div key={product.productID} style={styles.productCard}>
                            {/* Optional Image Placeholder */}
                            {/* <img src="placeholder.jpg" alt="Product" style={styles.productImage} /> */}
                            <h2 style={styles.productTitle}>{product.productName}</h2>
                            <p><strong>Product ID:</strong> {product.productID}</p>
                            <p><strong>Category:</strong> {product.productCategory}</p>
                            <p style={styles.productPrice}>LKR {product.price.toFixed(2)}</p>
                            <p><strong>Stock:</strong> {product.stockQuantity}</p>
                            <p><strong>Supplier:</strong> {product.supplierID}</p>
                            <p>{product.description}</p>
                            <div style={styles.buttonGroup}>
                                <button style={styles.productButton} onClick={() => {
                                    // Get the existing cart from localStorage
                                    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

                                    // Add the new product to the cart
                                    const updatedCart = [...existingCart, product];

                                    // Save it back to localStorage
                                    localStorage.setItem('cart', JSON.stringify(updatedCart));

                                    // Navigate to cart page
                                    navigate('/cart');
                                }}>Add to Cart</button>
                                <button style={styles.buyNowButton} onClick={() => navigate(`/item/${product.productID}`, { state: { product } })}>Buy Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <footer style={styles.footer}>
                <p style={styles.footerText}>© {new Date().getFullYear()} Farmer's Market | All rights reserved</p>
            </footer>
        </div>
    );
};

export default ProductList;

const styles = {
    pageContainer: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f4f7f6",
        color: "#333",
        padding: "0",
        margin: "0",
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
        color: "#2e7d32",
    },
    productsContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "20px",
    },
    productCard: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
        width: "250px",
        padding: "20px",
        textAlign: "left",
        transition: "transform 0.3s",
    },
    productImage: {
        width: "100%",
        height: "auto",
        borderRadius: "8px",
    },
    productTitle: {
        fontSize: "18px",
        fontWeight: "600",
        margin: "10px 0 5px",
        color: "#27ae60",
    },
    productPrice: {
        fontSize: "16px",
        color: "#27ae60",
        margin: "8px 0",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        marginTop: "10px",
    },
    productButton: {
        backgroundColor: "#f39c12",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        flex: 1,
    },
    buyNowButton: {
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "pointer",
        flex: 1,
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
