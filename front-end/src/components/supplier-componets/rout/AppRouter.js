import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SupplierNavbar from '../components/SupplierNavbar';
import OrdersPage from '../pages/OrdersPage';
import HomePage from '../pages/HomePage';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <SupplierNavbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/orders" element={<OrdersPage />} />
            </Routes>
        </BrowserRouter>
    );
}