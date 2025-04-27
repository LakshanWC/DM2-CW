import React, { useEffect, useState } from 'react';

const ItemCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const handleRemoveItem = (indexToRemove) => {
        const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (index, newQuantity) => {
        const updatedCart = [...cartItems];
        const product = updatedCart[index];
        newQuantity = Math.max(1, Math.min(newQuantity, product.stockQuantity));
        updatedCart[index].quantity = newQuantity;
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateItemTotal = (price, quantity) => {
        return (price * quantity).toFixed(2);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0).toFixed(2);
    };

    const handleCheckout = () => {
        if (!deliveryAddress.trim()) {
            alert('Please enter a delivery address');
            return;
        }

        // Here you would typically send the order to your backend
        const order = {
            items: cartItems,
            deliveryAddress,
            paymentMethod,
            total: calculateCartTotal(),
            date: new Date().toISOString()
        };

        console.log('Order submitted:', order);
        alert('Order placed successfully!');

        // Clear cart after successful order
        localStorage.removeItem('cart');
        setCartItems([]);
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
                        <p style={styles.text}><strong>Unit Price:</strong> LKR {item.price.toFixed(2)}</p>
                        <p style={styles.text}><strong>Available:</strong> {item.stockQuantity}</p>
                        <p style={styles.text}><strong>Supplier ID:</strong> {item.supplierID}</p>


                        <div style={styles.quantityContainer}>
                            <button
                                style={{
                                    ...styles.quantityButton,
                                    ...(item.quantity <= 1 ? styles.disabledButton : {})
                                }}
                                onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span style={styles.quantityText}>{item.quantity}</span>
                            <button
                                style={{
                                    ...styles.quantityButton,
                                    ...(item.quantity >= item.stockQuantity ? styles.disabledButton : {})
                                }}
                                onClick={() => handleQuantityChange(index, item.quantity + 1)}
                                disabled={item.quantity >= item.stockQuantity}
                            >
                                +
                            </button>
                        </div>

                        <p style={styles.text}>
                            <strong>Item Total:</strong> LKR {calculateItemTotal(item.price, item.quantity)}
                        </p>
                        <p style={styles.description}>{item.description}</p>
                    </div>
                    <button
                        style={styles.removeButton}
                        onClick={() => handleRemoveItem(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}

            <div style={styles.cartTotal}>
                <h2 style={styles.totalText}>Cart Total: LKR {calculateCartTotal()}</h2>
            </div>

            <button
                style={styles.checkoutButton}
                onClick={() => setIsCheckoutOpen(!isCheckoutOpen)}
            >
                {isCheckoutOpen ? 'Hide Checkout' : 'Proceed to Checkout'}
            </button>

            {isCheckoutOpen && (
                <div style={styles.checkoutForm}>
                    <h2 style={styles.checkoutTitle}>Delivery Information</h2>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Delivery Address:</label>
                        <textarea
                            style={styles.addressInput}
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Enter your full delivery address"
                            rows="4"
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Payment Method:</label>
                        <select
                            style={styles.paymentSelect}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                        </select>
                    </div>

                    <button
                        style={styles.placeOrderButton}
                        onClick={handleCheckout}
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

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
        position: "relative",
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
    description: {
        margin: "8px 0",
        fontSize: "16px",
        color: "#777",
        fontStyle: "italic",
    },
    quantityContainer: {
        display: "flex",
        alignItems: "center",
        margin: "15px 0",
        gap: "10px",
    },
    quantityButton: {
        backgroundColor: "#f0f0f0",
        border: "none",
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#e0e0e0",
        },
    },
    disabledButton: {
        backgroundColor: "#f5f5f5",
        cursor: "not-allowed",
        color: "#999",
        '&:hover': {
            backgroundColor: "#f5f5f5",
        },
    },
    quantityText: {
        fontSize: "18px",
        fontWeight: "bold",
        minWidth: "30px",
        textAlign: "center",
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
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#c0392b",
        },
    },
    emptyCart: {
        padding: "80px",
        textAlign: "center",
        fontSize: "24px",
        color: "#888",
    },
    cartTotal: {
        backgroundColor: "#2c3e50",
        color: "white",
        padding: "25px 40px",
        borderRadius: "15px",
        marginTop: "30px",
        textAlign: "right",
    },
    totalText: {
        margin: "0",
        fontSize: "24px",
    },
    checkoutButton: {
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        padding: "15px 30px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        display: "block",
        margin: "30px auto",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#2980b9",
        },
    },
    checkoutForm: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        marginTop: "20px",
    },
    checkoutTitle: {
        fontSize: "24px",
        color: "#2c3e50",
        marginBottom: "20px",
        textAlign: "center",
    },
    formGroup: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
    },
    addressInput: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "16px",
        resize: "vertical",
    },
    paymentSelect: {
        width: "100%",
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "16px",
        backgroundColor: "white",
    },
    placeOrderButton: {
        backgroundColor: "#27ae60",
        color: "white",
        border: "none",
        padding: "15px 30px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "18px",
        display: "block",
        margin: "20px auto 0",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#219653",
        },
    },
};

export default ItemCart;