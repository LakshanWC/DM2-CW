import React, { useEffect, useState } from 'react';

const ItemCart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const handleRemoveItem = (indexToRemove) => {
        const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    if (cartItems.length === 0) {
        return (
            <div style={styles.emptyCart}>
                <p>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🛒 Your Cart</h1>
            {cartItems.map((item, index) => (
                <div key={index} style={styles.cartItem}>
                    <div style={styles.itemDetails}>
                        <h2 style={styles.productName}>{item.productName}</h2>
                        <p style={styles.text}><strong>Price:</strong> LKR {item.price.toFixed(2)}</p>
                        <p style={styles.text}><strong>Quantity:</strong> 1 (default)</p>
                        <p style={styles.text}>{item.description}</p>
                    </div>
                    <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveItem(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ItemCart;

const styles = {
    container: {
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        fontSize: "36px",
        marginBottom: "40px",
        textAlign: "center",
        color: "#2c3e50",
    },
    cartItem: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: "30px 40px",
        marginBottom: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        minHeight: "180px",
    },
    itemDetails: {
        flex: "1",
        paddingRight: "40px",
    },
    productName: {
        fontSize: "26px",
        color: "#27ae60",
        marginBottom: "15px",
    },
    text: {
        margin: "8px 0",
        fontSize: "18px",
        color: "#555",
    },
    removeButton: {
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        height: "fit-content",
        alignSelf: "flex-start",
    },
    emptyCart: {
        padding: "80px",
        textAlign: "center",
        fontSize: "24px",
        color: "#888",
    },
};
