import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ItemPage = ({ currentActiveUser, userID }) => {
    const { state } = useLocation();
    const product = state?.product;

    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');
    const [address, setAddress] = useState('');
    const [reviews, setReviews] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [newReview, setNewReview] = useState({
        reviewScore: 5,
        description: ''
    });
    const [newFeedback, setNewFeedback] = useState({
        feedbackType: 'Complaint',
        description: ''
    });
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [hasUserFeedback, setHasUserFeedback] = useState(false);
    const [isFeedback, setIsFeedback] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        if (product?.productID) {
            fetchReviews();
        }
        if (product?.supplierID) {
            fetchFeedbacks();
        }
    }, [product?.productID, product?.supplierID]);

    useEffect(() => {
        if (currentActiveUser && reviews.length > 0) {
            const userReview = reviews.find(review => review.userName === currentActiveUser);
            setHasUserReviewed(!!userReview);
        } else {
            setHasUserReviewed(false);
        }
    }, [reviews, currentActiveUser]);

    useEffect(() => {
        if (currentActiveUser && feedbacks.length > 0) {
            const userFeedback = feedbacks.find(feedback => feedback.userName === currentActiveUser);
            setHasUserFeedback(!!userFeedback);
        } else {
            setHasUserFeedback(false);
        }
    }, [feedbacks, currentActiveUser]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8082/reviews/${product.productID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error('Failed to load reviews:', err);
            alert('Failed to load reviews. Please try again later.');
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch(`http://localhost:8082/feedbacks/${product.supplierID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch feedbacks');
            }
            const data = await response.json();
            setFeedbacks(data);
        } catch (err) {
            console.error('Failed to load feedbacks:', err);
            alert('Failed to load feedbacks. Please try again later.');
        }
    };

    const handleOrder = async () => {
        if (!address) {
            alert('Please enter a delivery address');
            return;
        }

        if (quantity <= 0 || quantity > product.stockQuantity) {
            alert(`Please enter a valid quantity between 1 and ${product.stockQuantity}`);
            return;
        }

        setIsPlacingOrder(true);

        const orderDetails = {
            orderDate: new Date().toISOString().split('T')[0],
            paymentType: paymentMethod,
            userId: userID,
            deliveryAddress: address,
            products: [
                {
                    productId: product.productID,
                    quantity: quantity,
                    subtotal: product.price * quantity
                }
            ]
        };

        try {
            const response = await fetch('http://localhost:8082/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            const responseText = await response.text();
            let responseData;

            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Non-JSON response from server:', responseText);
                throw new Error(responseText);
            }

            if (!response.ok) {
                console.error('Server responded with error:', responseData);
                throw new Error(responseData.message || responseText || 'Failed to place order');
            }

            console.log('Order placed successfully:', responseData);
            alert('Order placed successfully!');

            setQuantity(1);
            setAddress('');
        } catch (error) {
            console.error('Error placing order:', error.message);
            alert(error.message || 'Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!currentActiveUser) {
            alert('Please log in to submit a review');
            return;
        }

        if (hasUserReviewed && !isFeedback) {
            alert('You have already reviewed this product');
            return;
        }

        if (hasUserFeedback && isFeedback) {
            alert('You have already submitted feedback for this supplier');
            return;
        }

        const dataToSubmit = isFeedback ? {
            supplierId: product?.supplierID,
            userName: currentActiveUser,
            category: newFeedback.feedbackType,
            feedBack: newFeedback.description,
            reply: '',
            createdAt: new Date().toISOString()
        } : {
            userName: currentActiveUser,
            productId: parseInt(product?.productID, 10),
            reviewScore: newReview.reviewScore,
            description: newReview.description,
            reviewDate: new Date().toISOString(),
            reply: ''
        };

        const url = isFeedback ? 'http://localhost:8082/feedbacks' : 'http://localhost:8082/reviews';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (!response.ok) {
                throw new Error('Failed to submit data');
            }

            alert(isFeedback ? 'Feedback submitted successfully!' : 'Review submitted successfully!');

            setNewReview({ reviewScore: 5, description: '' });
            setNewFeedback({ feedbackType: 'Complaint', description: '' });

            if (isFeedback) {
                await fetchFeedbacks();
            } else {
                await fetchReviews();
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit data. Please try again.');
        }
    };

    if (!product) return <p>Product details not found.</p>;

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
                    <label style={styles.formLabel}>
                        Quantity:
                        <input
                            type="number"
                            min="1"
                            max={product.stockQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                            style={styles.input}
                        />
                    </label>
                    <label style={styles.formLabel}>
                        Payment Method:
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.input}
                        >
                            <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                        </select>
                    </label>
                    <label style={styles.formLabel}>
                        Delivery Address:
                        <textarea
                            rows="4"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={styles.textarea}
                            required
                            placeholder="Enter your full delivery address"
                        />
                    </label>
                    <button
                        onClick={handleOrder}
                        style={styles.orderButton}
                        disabled={isPlacingOrder}
                    >
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>

            <div style={styles.reviewSection}>
                <h3>Customer Reviews/Feedback</h3>

                <div style={styles.toggleButtonContainer}>
                    <button
                        onClick={() => setIsFeedback(false)}
                        style={!isFeedback ? styles.activeToggleButton : styles.toggleButton}
                    >
                        Write a Review
                    </button>
                    <button
                        onClick={() => setIsFeedback(true)}
                        style={isFeedback ? styles.activeToggleButton : styles.toggleButton}
                    >
                        Submit Feedback
                    </button>
                </div>

                {!isFeedback ? (
                    <>
                        <div style={styles.reviewFormContainer}>
                            {currentActiveUser && !hasUserReviewed ? (
                                <>
                                    <h4>Write a Review</h4>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>Your Rating:</label>
                                            <select
                                                value={newReview.reviewScore}
                                                onChange={(e) => setNewReview({...newReview, reviewScore: parseInt(e.target.value)})}
                                                style={styles.input}
                                                required
                                            >
                                                {[5, 4, 3, 2, 1].map(score => (
                                                    <option key={score} value={score}>{score}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>Your Review:</label>
                                            <textarea
                                                rows="4"
                                                value={newReview.description}
                                                onChange={(e) => setNewReview({...newReview, description: e.target.value})}
                                                style={styles.textarea}
                                                required
                                                placeholder="Share your experience with this product..."
                                                minLength="10"
                                            />
                                        </div>
                                        <button type="submit" style={styles.submitReviewButton}>
                                            Submit Review
                                        </button>
                                        <p style={styles.reviewNote}>Posting as {currentActiveUser}</p>
                                    </form>
                                </>
                            ) : currentActiveUser ? (
                                <p style={styles.infoText}>
                                    You've already reviewed this product.
                                </p>
                            ) : (
                                <p style={styles.infoText}>
                                    Please log in to submit a review.
                                </p>
                            )}
                        </div>

                        <h4>Product Reviews</h4>
                        {reviews.length === 0 ? (
                            <p style={styles.infoText}>No reviews yet for this product.</p>
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
                    </>
                ) : (
                    <>
                        <div style={styles.reviewFormContainer}>
                            {currentActiveUser && !hasUserFeedback ? (
                                <>
                                    <h4>Submit Feedback</h4>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>Feedback Type:</label>
                                            <select
                                                value={newFeedback.feedbackType}
                                                onChange={(e) => setNewFeedback({...newFeedback, feedbackType: e.target.value})}
                                                style={styles.input}
                                                required
                                            >
                                                <option value="Complaint">Complaint</option>
                                                <option value="Improvement">Improvement</option>
                                                <option value="Suggestion">Suggestion</option>
                                            </select>
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.formLabel}>Your Feedback:</label>
                                            <textarea
                                                rows="4"
                                                value={newFeedback.description}
                                                onChange={(e) => setNewFeedback({...newFeedback, description: e.target.value})}
                                                style={styles.textarea}
                                                required
                                                placeholder="Share your feedback..."
                                                minLength="10"
                                            />
                                        </div>
                                        <button type="submit" style={styles.submitReviewButton}>
                                            Submit Feedback
                                        </button>
                                        <p style={styles.reviewNote}>Posting as {currentActiveUser}</p>
                                    </form>
                                </>
                            ) : currentActiveUser ? (
                                <p style={styles.infoText}>
                                    You've already submitted feedback for this supplier.
                                </p>
                            ) : (
                                <p style={styles.infoText}>
                                    Please log in to submit feedback.
                                </p>
                            )}
                        </div>

                        <h4>Supplier Feedbacks</h4>
                        {feedbacks.length === 0 ? (
                            <p style={styles.infoText}>No feedbacks yet for this supplier.</p>
                        ) : (
                            feedbacks.map((feedback) => (
                                <div key={feedback.feedBackId} style={styles.reviewCard}>
                                    <p><strong>{feedback.userName}</strong> — {new Date(feedback.createdAt).toLocaleDateString()}</p>
                                    <p>Type: {feedback.category}</p>
                                    <p>{feedback.feedBack}</p>
                                    {feedback.reply && (
                                        <p style={styles.reply}><strong>Supplier Reply:</strong> {feedback.reply}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        paddingBottom: '40px'
    },
    container: {
        display: 'flex',
        padding: '40px',
        gap: '40px',
        flexWrap: 'wrap'
    },
    left: {
        flex: 1,
        minWidth: '300px',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    right: {
        flex: 1,
        minWidth: '300px',
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
        padding: '10px',
        marginTop: '5px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        resize: 'vertical',
        fontSize: '16px',
        minHeight: '100px'
    },
    orderButton: {
        padding: '12px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
        ':disabled': {
            backgroundColor: '#95a5a6',
            cursor: 'not-allowed'
        }
    },
    reviewSection: {
        marginTop: '40px',
        padding: '0 40px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    reviewFormContainer: {
        backgroundColor: '#f8f9fa',
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #eaeaea',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    formGroup: {
        marginBottom: '20px'
    },
    formLabel: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        fontSize: '15px'
    },
    submitReviewButton: {
        padding: '12px 24px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#2980b9'
        }
    },
    reviewNote: {
        marginTop: '10px',
        fontSize: '13px',
        color: '#7f8c8d'
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    reply: {
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px dashed #ddd',
        color: '#2c3e50',
        fontStyle: 'italic'
    },
    toggleButtonContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    },
    toggleButton: {
        padding: '10px 20px',
        backgroundColor: '#bdc3c7',
        color: '#2c3e50',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'all 0.3s'
    },
    activeToggleButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px',
        transition: 'all 0.3s'
    },
    infoText: {
        color: '#7f8c8d',
        fontStyle: 'italic',
        marginBottom: '20px',
        fontSize: '15px'
    }
};

export default ItemPage;