import React from 'react';
import { Button, Menu, MenuItem, Alert } from '@mui/material';
import { acceptOrder, cancelOrder, updateOrderStatus } from '../api/api';

export default function OrderActions({ order, supplierId, onUpdate }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setError] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setError(null);
    };

    const handleAccept = async () => {
        try {
            await acceptOrder(order.orderDetailId, supplierId);
            onUpdate();
            handleClose();
        } catch (error) {
            console.error('Error accepting order:', error);
            setError(error.response?.data || 'Failed to accept order');
        }
    };

    const handleCancel = async () => {
        try {
            const reason = prompt('Please enter cancellation reason:');
            if (reason) {
                await cancelOrder(order.orderDetailId, supplierId, reason);
                onUpdate();
                handleClose();
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            setError(error.response?.data || 'Failed to cancel order');
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateOrderStatus(order.orderId, supplierId, newStatus);
            onUpdate();
            handleClose();
        } catch (error) {
            console.error('Error updating status:', error);
            setError(error.response?.data || 'Failed to update status');
        }
    };

    const isPaymentCompleted = order.paymentStatus === 'Completed';
    const canCancel = ['Failed', 'Refunded'].includes(order.paymentStatus) || order.status === 'Pending';

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleClick}
            >
                Actions
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {order.status === 'Pending' && (
                    <MenuItem
                        onClick={handleAccept}
                        disabled={!isPaymentCompleted}
                    >
                        Accept
                    </MenuItem>
                )}
                {canCancel && (
                    <MenuItem onClick={handleCancel}>
                        Cancel
                    </MenuItem>
                )}
                {order.status === 'Accepted' && (
                    <MenuItem onClick={() => handleStatusUpdate('Shipped')}>
                        Mark as Shipped
                    </MenuItem>
                )}
                {order.status === 'Shipped' && (
                    <MenuItem onClick={() => handleStatusUpdate('Delivered')}>
                        Mark as Delivered
                    </MenuItem>
                )}
                {error && (
                    <Alert severity="error" sx={{ m: 1 }}>
                        {error}
                    </Alert>
                )}
            </Menu>
        </div>
    );
}