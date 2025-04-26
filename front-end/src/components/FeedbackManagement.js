import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FeedbackManagement() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:8082/feedbacks');
            setFeedbacks(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDeleteFeedback = async (feedBackId) => {
        if (window.confirm(`Delete this feedback permanently?`)) {
            try {
                await axios.delete(`http://localhost:8082/feedbacks/${feedBackId}`);
                fetchFeedbacks();
            } catch (err) {
                alert(`Error: ${err.response?.data || err.message}`);
            }
        }
    };

    const handleReplySubmit = async (feedBackId) => {
        if (!replyText.trim()) {
            alert("Reply cannot be empty!");
            return;
        }

        try {
            await axios.put('http://localhost:8082/feedbacks', {
                feedBackId: feedBackId,
                reply: replyText
            });
            setReplyText('');
            setActiveReplyId(null);
            fetchFeedbacks();
        } catch (err) {
            alert(`Error: ${err.response?.data || err.message}`);
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const safeSupplierId = String(feedback.supplierId || '').toLowerCase();
        const safeUser = (feedback.userName || '').toLowerCase();
        const safeFeedback = (feedback.feedBack || '').toLowerCase();
        const safeSearchTerm = searchTerm.toLowerCase();

        return safeSupplierId.includes(safeSearchTerm) ||
            safeUser.includes(safeSearchTerm) ||
            safeFeedback.includes(safeSearchTerm);
    });

    if (loading) return <div style={styles.loading}>Loading feedbacks...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Feedback Management</h2>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search by supplier ID, user, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.tableHeader}>Supplier ID</th>
                        <th style={styles.tableHeader}>User</th>
                        <th style={styles.tableHeader}>Category</th>
                        <th style={styles.tableHeader}>Feedback</th>
                        <th style={styles.tableHeader}>Reply</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((feedback) => (
                            <React.Fragment key={feedback.feedBackId}>
                                <tr style={styles.tableRow}>
                                    <td style={styles.tableCell}>{feedback.supplierId}</td>
                                    <td style={styles.tableCell}>{feedback.userName}</td>
                                    <td style={styles.tableCell}>{feedback.category}</td>
                                    <td style={styles.tableCell}>{feedback.feedBack}</td>
                                    <td style={styles.tableCell}>
                                        {feedback.reply || "No reply yet"}
                                    </td>
                                    <td style={styles.tableCell}>
                                        <button
                                            onClick={() => {
                                                setActiveReplyId(activeReplyId === feedback.feedBackId ? null : feedback.feedBackId);
                                                setReplyText(feedback.reply || '');
                                            }}
                                            style={styles.replyButton}
                                        >
                                            {activeReplyId === feedback.feedBackId ? 'Cancel' : 'Reply'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFeedback(feedback.feedBackId)}
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {activeReplyId === feedback.feedBackId && (
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
                                                    onClick={() => handleReplySubmit(feedback.feedBackId)}
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
                                No feedbacks found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Reused styles from ReviewManagement.js
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

export default FeedbackManagement;