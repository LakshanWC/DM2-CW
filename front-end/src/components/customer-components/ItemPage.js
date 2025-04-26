import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ItemPage = ({ currentActiveUser, userID }) => {
    const { state } = useLocation();
    const product = state?.product;

    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [address, setAddress] = useState('');
    const [reviews, setReviews] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [newReview, setNewReview] = useState({
        reviewScore: 5,
        description: ''
    });
    const [newFeedback, setNewFeedback] = useState({
        feedbackType: 'Complaint', // Default feedback type
        description: ''
    });
    const [hasUserReviewed, setHasUserReviewed] = useState(false);
    const [hasUserFeedback, setHasUserFeedback] = useState(false);
    const [isFeedback, setIsFeedback] = useState(false); // Track if it's a feedback instead of a review

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

    const fetchReviews = () => {
        fetch(`http://localhost:8082/reviews/${product.productID}`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error('Failed to load reviews:', err));
    };

    const fetchFeedbacks = () => {
        fetch(`http://localhost:8082/feedbacks/${product.supplierID}`)
            .then(res => res.json())
            .then(data => setFeedbacks(data))
            .catch(err => console.error('Failed to load feedbacks:', err));
    };

    if (!product) return <p>Product details not found.</p>;

    const handleOrder = () => {
        const orderDetails = {
            userID: currentActiveUser?.userID || 'Guest',
            productID: product.productID,
            quantity,
            paymentMethod,
            address
        };
        console.log('Order Placed:', orderDetails);
        alert('Order placed successfully!');
    };

    const handleReviewSubmit = (e) => {
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
        console.log("Data being sent:", dataToSubmit);

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        })
            .then(response => response.json())
            .then(() => {
                alert(isFeedback ? 'Feedback submitted successfully!' : 'Review submitted successfully!');
                setNewReview({ reviewScore: 5, description: '' });
                setNewFeedback({ feedbackType: 'Complaint', description: '' });
                if (isFeedback) {
                    fetchFeedbacks();
                } else {
                    fetchReviews();
                }
            })
            .catch(error => {
                console.error('Error submitting data:', error);
                alert('Failed to submit data');
            });
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
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
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

            <div style={styles.reviewSection}>
                <h3>Customer Reviews/Feedback</h3>

                {/* Toggle between Review and Feedback */}
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

                {/* Review Form */}
                {!isFeedback && (
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
                                            <option value="5">5</option>
                                            <option value="4">4</option>
                                            <option value="3">3</option>
                                            <option value="2">2</option>
                                            <option value="1">1</option>
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
                                        />
                                    </div>
                                    <button type="submit" style={styles.submitReviewButton}>
                                        Submit Review
                                    </button>
                                    <p style={styles.reviewNote}>Posting as {currentActiveUser}</p>
                                </form>
                            </>
                        ) : currentActiveUser ? (
                            <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '20px' }}>
                                You've already reviewed this product.
                            </p>
                        ) : (
                            <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '20px' }}>
                                Please log in to submit a review.
                            </p>
                        )}
                    </div>
                )}

                {/* Feedback Form */}
                {isFeedback && (
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
                                        />
                                    </div>
                                    <button type="submit" style={styles.submitReviewButton}>
                                        Submit Feedback
                                    </button>
                                    <p style={styles.reviewNote}>Posting as {currentActiveUser}</p>
                                </form>
                            </>
                        ) : currentActiveUser ? (
                            <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '20px' }}>
                                You've already submitted feedback for this supplier.
                            </p>
                        ) : (
                            <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '20px' }}>
                                Please log in to submit feedback.
                            </p>
                        )}
                    </div>
                )}

                {/* Reviews List */}
                {!isFeedback && (
                    <>
                        <h4>Product Reviews</h4>
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
                    </>
                )}

                {/* Feedbacks List */}
                {isFeedback && (
                    <>
                        <h4>Supplier Feedbacks</h4>
                        {feedbacks.length === 0 ? (
                            <p>No feedbacks yet for this supplier.</p>
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
    reviewFormContainer: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #eaeaea'
    },
    formGroup: {
        marginBottom: '15px'
    },
    formLabel: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '600'
    },
    submitReviewButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    reviewNote: {
        marginTop: '10px',
        fontSize: '12px',
        color: '#7f8c8d'
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
    },
    toggleButton: {
        padding: '10px',
        marginRight: '10px',
        backgroundColor: '#ccc',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    activeToggleButton: {
        padding: '10px',
        marginRight: '10px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};