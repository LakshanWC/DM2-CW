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

    const addToCart = (product) => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if product already exists in cart
        const existingItemIndex = existingCart.findIndex(item => item.productID === product.productID);

        if (existingItemIndex >= 0) {
            // Update quantity if already in cart (increment by 1)
            const updatedCart = [...existingCart];
            updatedCart[existingItemIndex].quantity += 1;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        } else {
            // Add new item with quantity 1
            const cartItem = {
                ...product,
                quantity: 1
            };
            localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
        }

        navigate('/cart');
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.featuredSection}>
                <h1 style={styles.sectionTitle}>Fresh From the Farm</h1>
                <div style={styles.productsContainer}>
                    {products.map(product => (
                        <div key={product.productID} style={styles.productCard}>
                            <h2 style={styles.productTitle}>{product.productName}</h2>
                            <p><strong>Product ID:</strong> {product.productID}</p>
                            <p><strong>Category:</strong> {product.productCategory}</p>
                            <p style={styles.productPrice}>LKR {product.price.toFixed(2)}</p>
                            <p><strong>Available:</strong> {product.stockQuantity}</p>
                            <p><strong>Supplier:</strong> {product.supplierID}</p>
                            <p>{product.description}</p>

                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.productButton}
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    style={styles.buyNowButton}
                                    onClick={() => navigate(`/item/${product.productID}`, { state: { product } })}
                                >
                                    Buy Now
                                </button>
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
        '&:hover': {
            transform: "translateY(-5px)",
        },
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
        fontWeight: "bold",
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
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#e67e22",
        },
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
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#219653",
        },
    },
    footer: {
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#2c3e50",
        color: "white",
        marginTop: "40px",
    },
    footerText: {
        fontSize: "14px",
        margin: "0",
    },
};

export default ProductList;