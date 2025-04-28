import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SupplierNavbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Supplier Dashboard
                </Typography>
                <Button color="inherit" onClick={() => navigate('/orders')}>
                    Orders Management
                </Button>
            </Toolbar>
        </AppBar>
    );
}