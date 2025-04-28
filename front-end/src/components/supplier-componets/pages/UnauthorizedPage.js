import React from 'react';
import { Typography } from '@mui/material';

export default function UnauthorizedPage() {
    return (
        <Typography variant="h4" color="error" sx={{ p: 3 }}>
            Unauthorized Access
        </Typography>
    );
}