import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

export default function SupplierIdForm({ onSubmit }) {
    const [supplierId, setSupplierId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(supplierId);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Enter Supplier ID
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Supplier ID"
                    variant="outlined"
                    fullWidth
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
}