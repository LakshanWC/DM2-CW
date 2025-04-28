import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button,
    Box, Typography, IconButton, Tooltip, Alert, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Snackbar
} from '@mui/material';
import {
    Check as CheckIcon,
    LocalShipping as ShippedIcon,
    DoneAll as DeliveredIcon,
    Close as CancelIcon
} from '@mui/icons-material';
import {
    getOrders, getPendingOrders,
    acceptOrder, cancelOrder,
    updateOrderStatus
} from '../api/api';

export default function OrdersTable({ showAll, supplierId, onBack }) {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchOrders = async () => {
        try {
            const response = showAll
                ? await getOrders(supplierId)
                : await getPendingOrders(supplierId);
            console.log('API Response:', response.data);
            setOrders(response.data);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data || 'Failed to fetch orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [showAll, supplierId]);

    const handleAccept = async (orderId, orderDetailId) => {
        try {
            await acceptOrder(orderDetailId, supplierId);
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId
                    ? { ...order, orderStatus: 'Accepted' }
                    : order
            ));
            await fetchOrders();
            setSnackbarMessage('Order Accepted Successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error accepting order:', error);
            setError(error.response?.data || 'Failed to accept order');
        }
    };

    const openCancelDialog = (order) => {
        setCurrentOrder(order);
        setCancelDialogOpen(true);
    };

    const handleCancel = async () => {
        try {
            await cancelOrder(currentOrder.orderDetailId, supplierId, cancelReason);
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === currentOrder.orderId
                    ? { ...order, orderStatus: 'Cancelled', cancellationReason: cancelReason }
                    : order
            ));
            setCancelDialogOpen(false);
            setCancelReason('');
            await fetchOrders();
            setSnackbarMessage('Order Cancelled Successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error cancelling order:', error);
            setError(error.response?.data || 'Failed to cancel order');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, supplierId, newStatus);
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId
                    ? {
                        ...order,
                        orderStatus: newStatus,
                        deliveredDate: newStatus === 'Delivered' ? new Date().toISOString() : order.deliveredDate
                    }
                    : order
            ));
            await fetchOrders();
            setSnackbarMessage(`Order marked as ${newStatus}!`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error(`Error updating status to ${newStatus}:`, error);
            setError(error.response?.data || `Failed to update status to ${newStatus}`);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const getActionButtons = (order) => {
        const canAccept = order.paymentStatus === 'Completed' && order.orderStatus === 'Pending';
        const canShip = order.orderStatus === 'Accepted';
        const canDeliver = order.orderStatus === 'Shipped';
        const canCancel = ['Failed', 'Refunded'].includes(order.paymentStatus) || order.orderStatus === 'Pending';

        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={canAccept ? "Accept Order" : "Order must be Pending and Payment must be Completed"}>
                    <span>
                        <IconButton color="success" onClick={() => handleAccept(order.orderId, order.orderDetailId)} disabled={!canAccept}>
                            <CheckIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={canShip ? "Mark as Shipped" : "Order must be Accepted first"}>
                    <span>
                        <IconButton color="info" onClick={() => handleStatusUpdate(order.orderId, 'Shipped')} disabled={!canShip}>
                            <ShippedIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={canDeliver ? "Mark as Delivered" : "Order must be Shipped first"}>
                    <span>
                        <IconButton color="secondary" onClick={() => handleStatusUpdate(order.orderId, 'Delivered')} disabled={!canDeliver}>
                            <DeliveredIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title={canCancel ? "Cancel Order" : "Can only cancel Pending or Failed/Refunded payments"}>
                    <span>
                        <IconButton color="error" onClick={() => openCancelDialog(order)} disabled={!canCancel}>
                            <CancelIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <Button variant="outlined" onClick={fetchOrders} sx={{ mb: 2 }}>Refresh Orders</Button>
            <Button onClick={onBack} sx={{ mb: 2, ml: 2 }} variant="outlined">BACK TO DASHBOARD</Button>

            <Typography variant="h5" sx={{ mb: 2 }}>{showAll ? 'All Orders' : 'Pending Orders'} - Supplier: {supplierId}</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Actions</TableCell>
                            <TableCell>Delivered Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.orderDetailId}>
                                <TableCell>{order.orderId}</TableCell>
                                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {order.deliveredDate ? 'Delivered' : order.orderStatus}
                                    {order.cancellationReason && (
                                        <Tooltip title={`Reason: ${order.cancellationReason}`}>
                                            <span> *</span>
                                        </Tooltip>
                                    )}
                                </TableCell>
                                <TableCell>{order.paymentStatus}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>${order.subTotal?.toFixed(2)}</TableCell>
                                <TableCell>{getActionButtons(order)}</TableCell>
                                <TableCell>{order.deliveredDate ? new Date(order.deliveredDate).toLocaleDateString() : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Cancel Dialog */}
            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Order #{currentOrder?.orderId}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Cancellation Reason"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCancel} disabled={!cancelReason}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
