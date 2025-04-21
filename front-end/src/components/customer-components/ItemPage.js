import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ItemPage = () => {
    const { state } = useLocation();
    const product = state?.product;

    const [quantity, setQuantity] = React.useState(1);
    const [paymentMethod, setPaymentMethod] = React.useState('Cash on Delivery');
    const [address, setAddress] = React.useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (product?.productID) {
            fetch(`http://localhost:8082/reviews/${product.productID}`)
                .then(res => res.json())
                .then(data => setReviews(data))
                .catch(err => console.error('Failed to load reviews:', err));
        }
    }, [product?.productID]);

    if (!product) return <p>Product details not found.</p>;

    const handleOrder = () => {
        const orderDetails = {
            productID: product.productID,
            quantity,
            paymentMethod,
            address
        };
        console.log('Order Placed:', orderDetails);
        alert('Order placed successfully!');
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.left}>
                    <h2>{product.productName}</h2>
                    <p><strong>Product ID:</strong> {product.productID}</p>
                    <p><strong>Category:</strong> {product.productCategory}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Price:</strong> LKR {product.price.toFixed(2)}</p>
                    <p><strong>Stock:</strong> {product.stockQuantity}</p>
                    <p><strong>Supplier:</strong> {product.supplierID}</p>
                </div>
                <div style={styles.right}>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            min="1"
                            max={product.stockQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={styles.input}
                        />
                    </label>
                    <label>
                        Payment Method:
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.input}
                        >
                            <option>Cash on Delivery (COD)</option>
                            <option>Credit Card</option>
                            <option>Debit Card</option>
                        </select>
                    </label>
                    <label>
                        Delivery Address:
                        <textarea
                            rows="4"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={styles.textarea}
                        />
                    </label>
                    <button onClick={handleOrder} style={styles.orderButton}>
                        Place Order
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={styles.reviewSection}>
                <h3>Customer Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews yet for this product.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.reviewId} style={styles.reviewCard}>
                            <p><strong>{review.userName}</strong> — {new Date(review.reviewDate).toLocaleDateString()}</p>
                            <p>⭐ {review.reviewScore} / 5</p>
                            <p>{review.description}</p>
                            {review.reply && (
                                <p style={styles.reply}><strong>Seller Reply:</strong> {review.reply}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ItemPage;

const styles = {
    page: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    container: {
        display: 'flex',
        padding: '40px',
        gap: '40px',
    },
    left: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
    },
    right: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc'
    },
    textarea: {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        resize: 'vertical'
    },
    orderButton: {
        padding: '12px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    reviewSection: {
        marginTop: '40px',
        padding: '0 40px'
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: '15px',
        marginBottom: '15px',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    reply: {
        marginTop: '10px',
        color: '#2c3e50',
        fontStyle: 'italic'
    }
};
