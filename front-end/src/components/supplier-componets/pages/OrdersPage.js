import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Typography,
    TextField,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress
} from '@mui/material';
import SupplierIdForm from '../components/SupplierIdForm';
import OrdersTable from '../components/OrdersTable';

export default function OrdersPage({ userId }) {
    const [view, setView] = useState(null);
    const [supplierId, setSupplierId] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [productForm, setProductForm] = useState({
        supplierID: '',
        productName: '',
        price: 0,
        productCategory: '',
        stockQuantity: 0,
        description: ''
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const [feedbackSupplierId, setFeedbackSupplierId] = useState(userId || '');

    // Initialize form with userId when it becomes available
    useEffect(() => {
        if (userId) {
            setProductForm(prev => ({
                ...prev,
                supplierID: userId
            }));
            setFeedbackSupplierId(userId);
        }
    }, [userId]);

    const productCategories = [
        'Fresh Vegetables',
        'Fresh Fruits',
        'Grains & Cereals',
        'Dairy Products',
        'Eggs & Poultry',
        'Meat & Fish',
        'Herbs & Spices',
        'Organic Products',
        'Processed Foods',
        'Flowers & Plants',
        'Other Farm Products'
    ];

    const handleFormSubmit = (id) => {
        setSupplierId(id);
        setShowTable(true);
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!productForm.supplierID) {
            setError('Supplier ID is required');
            return;
        }

        try {
            const response = await fetch('http://localhost:8089/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supplierID: productForm.supplierID,
                    productName: productForm.productName,
                    price: productForm.price,
                    productCategory: productForm.productCategory.toLowerCase().replace(/\s+/g, ''),
                    stockQuantity: productForm.stockQuantity,
                    description: productForm.description
                }),
            });

            const responseClone = response.clone();
            let responseData;

            const text = await responseClone.text();
            try {
                responseData = JSON.parse(text);
            } catch {
                responseData = text;
            }

            if (!response.ok) {
                throw new Error(responseData.message || responseData || `HTTP error! status: ${response.status}`);
            }

            console.log('Product added successfully:', responseData);
            setSuccess(typeof responseData === 'string' ? responseData : 'Product added successfully!');

            setProductForm({
                supplierID: userId || '',
                productName: '',
                price: 0,
                productCategory: '',
                stockQuantity: 0,
                description: ''
            });

            setTimeout(() => {
                setView(null);
                setSuccess(null);
            }, 2000);

        } catch (error) {
            console.error('Error adding product:', error);
            setError(error.message || 'Failed to add product. Please try again.');
        }
    };

    const handleProductInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value
        }));
    };

    const fetchFeedbacks = async () => {
        if (!feedbackSupplierId) {
            setError('Please enter a Supplier ID');
            return;
        }

        setLoadingFeedbacks(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8089/feedbacks/${feedbackSupplierId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch feedbacks: ${response.status}`);
            }
            const data = await response.json();
            setFeedbacks(data);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError(err.message || 'Failed to fetch feedbacks');
        } finally {
            setLoadingFeedbacks(false);
        }
    };

    if (!showTable) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Supplier Dashboard {userId ? `- ${userId}` : ''}
                </Typography>


                {!view ? (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => setView('all')}
                        >
                            All Orders
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => setView('pending')}
                        >
                            Pending Orders
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ backgroundColor: '#e8f5e9' }}
                            onClick={() => setView('addProduct')}
                        >
                            Add Product
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ backgroundColor: '#e3f2fd' }}
                            onClick={() => setView('feedbacks')}
                        >
                            View Feedbacks
                        </Button>
                    </Box>
                ) : view === 'addProduct' ? (
                    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
                        <Typography variant="h5" gutterBottom>Add New Product</Typography>
                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography color="success.main" sx={{ mb: 2 }}>
                                {success}
                            </Typography>
                        )}
                        <form onSubmit={handleAddProductSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Supplier ID"
                                name="supplierID"
                                value={productForm.supplierID}
                                onChange={handleProductInputChange}
                                required
                                disabled={!!userId}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Product Name"
                                name="productName"
                                value={productForm.productName}
                                onChange={handleProductInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Price"
                                name="price"
                                type="number"
                                value={productForm.price}
                                onChange={handleProductInputChange}
                                required
                                inputProps={{ min: 0, step: 0.01 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Product Category"
                                name="productCategory"
                                select
                                value={productForm.productCategory}
                                onChange={handleProductInputChange}
                                required
                            >
                                {productCategories.map(category => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Stock Quantity"
                                name="stockQuantity"
                                type="number"
                                value={productForm.stockQuantity}
                                onChange={handleProductInputChange}
                                required
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Description"
                                name="description"
                                value={productForm.description}
                                onChange={handleProductInputChange}
                                multiline
                                rows={4}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setView(null);
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!productForm.supplierID}
                                >
                                    Add Product
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                ) : view === 'feedbacks' ? (
                    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, margin: 'auto', mt: 4 }}>
                        <Typography variant="h5" gutterBottom>Product Feedbacks</Typography>

                        {!userId && (
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Supplier ID"
                                    value={feedbackSupplierId}
                                    onChange={(e) => setFeedbackSupplierId(e.target.value)}
                                    margin="normal"
                                    required
                                />
                            </Box>
                        )}

                        {error && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            onClick={fetchFeedbacks}
                            disabled={loadingFeedbacks}
                            sx={{ mb: 3 }}
                        >
                            {loadingFeedbacks ? <CircularProgress size={24} /> : 'Load Feedbacks'}
                        </Button>

                        {feedbacks.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Feedback</TableCell>
                                            <TableCell>Reply</TableCell>
                                            <TableCell>Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {feedbacks.map((feedback) => (
                                            <TableRow key={feedback.feedBackId}>
                                                <TableCell>{feedback.userName}</TableCell>
                                                <TableCell>{feedback.category}</TableCell>
                                                <TableCell>{feedback.feedBack}</TableCell>
                                                <TableCell>{feedback.reply || 'No reply yet'}</TableCell>
                                                <TableCell>
                                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : !loadingFeedbacks && feedbacks.length === 0 ? (
                            <Typography color="textSecondary" sx={{ mt: 2 }}>
                                No feedbacks found for this supplier.
                            </Typography>
                        ) : null}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setView(null);
                                    setError(null);
                                    setFeedbacks([]);
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    </Paper>
                ) : (
                    <SupplierIdForm
                        onSubmit={handleFormSubmit}
                    />
                )}
            </Box>
        );
    }

    return (
        <OrdersTable
            showAll={view === 'all'}
            supplierId={supplierId}
            onBack={() => {
                setShowTable(false);
                setView(null);
            }}
        />
    );
}