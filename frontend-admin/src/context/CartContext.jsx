import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { user } = useAuth();

    const fetchCartItems = async () => {
        if (!user) return;
        try {
            const response = await API.get('/cart');
            // The new backend returns { success: true, cart: { items: [...] } }
            setCartItems(response.data.cart?.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }
        try {
            // New endpoint: /api/cart/add with { productId, quantity }
            await API.post('/cart/add', { productId, quantity });
            alert('Added to luxury bag!');
            fetchCartItems();
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            // New endpoint: /api/cart/:id
            await API.delete(`/cart/${productId}`);
            fetchCartItems();
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        try {
            // We'll use a new endpoint /api/cart/update or just re-add with difference
            // For now, let's assume /api/cart/update exists
            await API.put(`/cart/${productId}`, { quantity });
            fetchCartItems();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const checkout = async (orderData) => {
        try {
            const response = await API.post('/orders', orderData);
            if (response.data.success) {
                setCartItems([]);
                return response.data;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        }
        return false;
    };

    useEffect(() => {
        if (user) {
            fetchCartItems();
        } else {
            setCartItems([]);
        }
    }, [user]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, checkout, fetchCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
