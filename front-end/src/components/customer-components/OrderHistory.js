import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = ({ userId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderItems, setOrderItems] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/orders/${userId}`);
                setOrders(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchOrderHistory();
        }
    }, [userId]);

    const handleCardClick = async (orderId) => {
        if (selectedOrderId === orderId) {
            setOrderItems(null);
            setSelectedOrderId(null);
        } else {
            try {
                const response = await axios.get(`http://localhost:8082/orders/${orderId}/order-items`);
                setOrderItems(response.data);
                setSelectedOrderId(orderId);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="order-history-container">
            <h2>Order History</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="order-cards-container">
                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className={`order-card ${selectedOrderId === order.orderId ? 'expanded' : ''}`}
                            onClick={() => handleCardClick(order.orderId)}
                        >
                            <div className="order-summary">
                                <h3>Order #{order.orderId}</h3>
                                <div className="order-meta">
                                    <div className="meta-item">
                                        <span className="label">Status:</span>
                                        <span className="value">{order.status}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">Date:</span>
                                        <span className="value">{new Date(order.orderDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">Total:</span>
                                        <span className="value">LKR {order.totalAmount}</span>
                                    </div>
                                </div>
                                <div className="payment-info">
                                    <div className="payment-item">
                                        <span className="label">Payment:</span>
                                        <span className="value">{order.paymenetStatus}</span>
                                    </div>
                                    <div className="payment-item">
                                        <span className="label">Type:</span>
                                        <span className="value">{order.paymentType}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrderId === order.orderId && orderItems && (
                                <div className="order-items-container">
                                    <h4>Order Items</h4>
                                    <ul>
                                        {orderItems.map((item) => (
                                            <li key={item.orderDetailId}>
                                                <p><strong>Product ID:</strong> {item.productId}</p>
                                                <p><strong>Quantity:</strong> {item.quantity}</p>
                                                <p><strong>SubTotal:</strong> LKR {item.subTotal}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
                .order-history-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    max-width: 1400px; /* Increased max width */
                    margin: auto;
                }

                .order-cards-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 20px;
                }

                .order-card {
                    background: #f9f9f9;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 25px 30px; /* Increased padding */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    width: 100%;
                    min-height: 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .order-card.expanded {
                    background: #f5f5f5;
                }

                .order-card:hover {
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .order-summary {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    gap: 30px; /* Added gap between elements */
                }

                .order-summary h3 {
                    font-size: 1.4em;
                    color: #333;
                    margin: 0;
                    min-width: 150px; /* Set minimum width for order number */
                }

                .order-meta {
                    display: flex;
                    gap: 40px; /* Increased gap */
                    flex-grow: 1; /* Allow to take available space */
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                }

                .label {
                    font-size: 0.9em;
                    color: #777;
                    margin-bottom: 4px;
                }

                .value {
                    font-size: 1.1em;
                    color: #333;
                    font-weight: 500;
                }

                .payment-info {
                    display: flex;
                    gap: 30px; /* Increased gap */
                    min-width: 250px; /* Set minimum width for payment info */
                }

                .payment-item {
                    display: flex;
                    flex-direction: column;
                }

                .order-items-container {
                    margin-top: 25px;
                    background: #f0f0f0;
                    padding: 25px;
                    border-radius: 6px;
                    border-top: 1px solid #ddd;
                }

                .order-items-container h4 {
                    font-size: 1.3em;
                    color: #333;
                    margin-bottom: 15px;
                }

                .order-items-container ul {
                    list-style-type: none;
                    padding-left: 0;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Wider items */
                    gap: 20px;
                }

                .order-items-container li {
                    padding: 15px;
                    background: #fff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .order-items-container li p {
                    margin: 8px 0;
                }

                .order-items-container li strong {
                    color: #555;
                }

                @media (max-width: 1200px) {
                    .order-summary {
                        flex-wrap: wrap;
                    }

                    .order-meta, .payment-info {
                        gap: 20px;
                    }
                }

                @media (max-width: 768px) {
                    .order-summary {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .order-meta, .payment-info {
                        width: 100%;
                        flex-wrap: wrap;
                    }

                    .meta-item, .payment-item {
                        min-width: 120px;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderHistory;