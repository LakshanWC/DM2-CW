import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReviewManagement() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null); // Track which review is being replied to
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:8082/reviews');
            setReviews(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm(`Delete this review permanently?`)) {
            try {
                await axios.delete(`http://localhost:8082/reviews/${reviewId}`);
                fetchReviews(); // Refresh the list
            } catch (err) {
                alert(`Error: ${err.response?.data || err.message}`);
            }
        }
    };

    const handleReplySubmit = async (reviewId) => {
        if (!replyText.trim()) {
            alert("Reply cannot be empty!");
            return;
        }

        try {
            await axios.put('http://localhost:8082/reviews', {
                reviewId: reviewId,
                reply: replyText
            });
            setReplyText('');
            setActiveReplyId(null);
            fetchReviews(); // Refresh to show the new reply
        } catch (err) {
            alert(`Error: ${err.response?.data || err.message}`);
        }
    };

    const filteredReviews = reviews.filter(review => {
        const safeProductId = String(review.productId || '').toLowerCase();
        const safeUser = (review.userName || '').toLowerCase();
        const safeDescription = (review.description || '').toLowerCase();
        const safeSearchTerm = searchTerm.toLowerCase();

        return safeProductId.includes(safeSearchTerm) ||
            safeUser.includes(safeSearchTerm) ||
            safeDescription.includes(safeSearchTerm);
    });

    if (loading) return <div style={styles.loading}>Loading reviews...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Review Management</h2>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by product ID, user, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {/* Reviews Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Product ID</th>
                        <th style={styles.tableHeader}>User</th>
                        <th style={styles.tableHeader}>Rating</th>
                        <th style={styles.tableHeader}>Description</th>
                        <th style={styles.tableHeader}>Reply</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review) => (
                            <React.Fragment key={review.reviewId}>
                                <tr style={styles.tableRow}>
                                    <td style={styles.tableCell}>{review.productId}</td>
                                    <td style={styles.tableCell}>{review.userName}</td>
                                    <td style={styles.tableCell}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    color: i < review.reviewScore ? '#f39c12' : '#ddd',
                                                    fontSize: '18px'
                                                }}
                                            >
                                                    ★
                                                </span>
                                        ))}
                                    </td>
                                    <td style={styles.tableCell}>{review.description}</td>
                                    <td style={styles.tableCell}>
                                        {review.reply || "No reply yet"}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            onClick={() => {
                                                setActiveReplyId(activeReplyId === review.reviewId ? null : review.reviewId);
                                                setReplyText(review.reply || '');
                                            }}
                                            style={styles.replyButton}
                                        >
                                            {activeReplyId === review.reviewId ? 'Cancel' : 'Reply'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review.reviewId)}
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {/* Reply Textarea (shown when active) */}
                                {activeReplyId === review.reviewId && (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '15px', backgroundColor: '#f9f9f9' }}>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                    <textarea
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        placeholder="Write your reply..."
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ddd',
                                                            minHeight: '60px'
                                                        }}
                                                    />
                                                <button
                                                    onClick={() => handleReplySubmit(review.reviewId)}
                                                    style={styles.submitButton}
                                                >
                                                    Submit Reply
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ ...styles.tableCell, textAlign: 'center' }}>
                                No reviews found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Reuse your existing styles from UserManagement.js with slight modifications
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    title: {
        color: '#2c3e50',
        fontSize: '24px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    searchContainer: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center'
    },
    searchInput: {
        padding: '10px 15px',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    tableContainer: {
        overflowX: 'auto',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white'
    },
    tableHeaderRow: {
        backgroundColor: '#2c3e50',
        color: 'white'
    },
    tableHeader: {
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600'
    },
    tableRow: {
        borderBottom: '1px solid #eee',
        '&:hover': {
            backgroundColor: '#f9f9f9'
        }
    },
    tableCell: {
        padding: '12px 15px',
        textAlign: 'left',
        verticalAlign: 'top'
    },
    replyButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#2980b9'
        }
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#c0392b'
        }
    },
    submitButton: {
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        '&:hover': {
            backgroundColor: '#219653'
        }
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '18px'
    },
    error: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '18px',
        color: '#e74c3c'
    }
};

export default ReviewManagement;