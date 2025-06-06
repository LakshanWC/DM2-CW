import React, { useState } from 'react';
import axios from 'axios';

const OrderDelivery = ({ userId }) => {
    const [orderId, setOrderId] = useState('');
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeliveries, setShowDeliveries] = useState(false);
    const [isInputFocused, setInputFocus] = useState(false);

    const handleInputChange = (event) => {
        setOrderId(event.target.value.trim()); // Trim whitespace from input
    };

    const handleTrackClick = async () => {
        if (!orderId) {
            alert('Please enter an Order ID');
            return;
        }

        console.log(`Tracking order with ID: ${orderId} for User ID: ${userId}`);
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:8089/deliveries/${userId}`);
            console.log('Full response data:', response.data);

            // Convert both values to strings for comparison to avoid type issues
            const filteredDelivery = response.data.filter(delivery =>
                delivery.orderID.toString() === orderId.toString()
            );

            console.log('Filtered results:', filteredDelivery);

            if (filteredDelivery.length === 0) {
                alert(`No delivery found for Order ID: ${orderId}`);
                setDeliveries([]);
                setShowDeliveries(false);
                return;
            }

            setDeliveries(filteredDelivery);
            setShowDeliveries(true);
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            alert('Failed to fetch delivery information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDeliveriesClick = async () => {
        if (showDeliveries) {
            setDeliveries([]);
            setShowDeliveries(false);
        } else {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8089/deliveries/${userId}`);
                setDeliveries(response.data);
                setShowDeliveries(true);
            } catch (error) {
                console.error('Error fetching deliveries:', error);
                alert('Failed to fetch deliveries. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '2rem',
    };

    const headingStyle = {
        fontSize: '2rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '2rem',
    };

    const inputContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '1.5rem',
    };

    const labelStyle = {
        fontSize: '1rem',
        marginBottom: '0.5rem',
        color: '#333',
    };

    const inputStyle = {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        width: '300px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
        ...(isInputFocused && { borderColor: '#4CAF50' }),
    };

    const buttonStyle = {
        padding: '0.75rem 2rem',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        margin: '0.5rem',
        ':hover': {
            backgroundColor: '#45a049',
        },
    };

    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        margin: '1rem',
        width: '300px',
        textAlign: 'left',
    };

    const cardTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1rem',
    };

    const cardContentStyle = {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '0.5rem',
    };

    return (
        <div style={containerStyle}>
            <h2 style={headingStyle}>Track Your Order</h2>
            <div style={inputContainerStyle}>
                <label htmlFor="order-id" style={labelStyle}>Order ID:</label>
                <input
                    type="text"
                    id="order-id"
                    value={orderId}
                    onChange={handleInputChange}
                    placeholder="Enter Order ID"
                    style={inputStyle}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                />
            </div>
            <div>
                <button
                    style={buttonStyle}
                    onClick={handleTrackClick}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                >
                    Track
                </button>
                <button
                    style={buttonStyle}
                    onClick={handleViewDeliveriesClick}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                >
                    {showDeliveries ? 'Hide All Deliveries' : 'View All Deliveries'}
                </button>
            </div>

            {loading ? (
                <p>Loading deliveries...</p>
            ) : (
                showDeliveries && deliveries.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {deliveries.map((delivery) => (
                            <div key={delivery.deliveryID} style={cardStyle}>
                                <h3 style={cardTitleStyle}>Delivery ID: {delivery.deliveryID}</h3>
                                <p style={cardContentStyle}><strong>Order ID:</strong> {delivery.orderID}</p>
                                <p style={cardContentStyle}><strong>Estimated Date:</strong> {delivery.estimatedDate}</p>
                                <p style={cardContentStyle}><strong>Status:</strong> {delivery.deliveryStatus}</p>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default OrderDelivery;