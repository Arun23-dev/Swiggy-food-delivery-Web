import { useState, useEffect, useMemo, useCallback } from 'react';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../Utils/Constants';

export const useCartSelection = (cartItems) => {
    // Store selected item IDs
    const [selectedItemIds, setSelectedItemIds] = useState(new Set());


    // AUTO-SELECT ALL when cart is not empty and nothing is selected (first load)
    useEffect(() => {
        if (cartItems.length > 0 && selectedItemIds.size === 0) {
            const allIds = cartItems.map(item => item.swiggyItemId);
            setSelectedItemIds(new Set(allIds));
        }
    }, [cartItems, selectedItemIds.size]);

    // Keep selection in sync when cart changes (e.g., item removed)
    useEffect(() => {
        const existingIds = new Set(cartItems.map(item => item.swiggyItemId));
        setSelectedItemIds(prev => new Set([...prev].filter(id => existingIds.has(id))));
    }, [cartItems]);

    // Derived: selected items array
    const selectedCartItems = useMemo(() => {
        return cartItems.filter(item => selectedItemIds.has(item.swiggyItemId));
    }, [cartItems, selectedItemIds]);

    // Derived: totals based only on selected items
    const selectedItemTotal = useMemo(() => {
        return selectedCartItems.reduce((sum, item) => {
            const priceInRupees = Math.floor((item.defaultPrice || item.price || 0) / 100);
            return sum + (priceInRupees * item.quantity);
        }, 0);
    }, [selectedCartItems]);

    const selectedDeliveryFee = selectedItemTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const selectedTotal = selectedItemTotal + selectedDeliveryFee;

    // Toggle single item
    const toggleSelectItem = useCallback((itemId) => {
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    // Select / deselect all
    const selectAll = useCallback(() => {
        if (selectedItemIds.size === cartItems.length && cartItems.length > 0) {
            setSelectedItemIds(new Set());
        } else {
            setSelectedItemIds(new Set(cartItems.map(item => item.swiggyItemId)));
        }
    }, [cartItems, selectedItemIds.size]);

    // Check if all are selected
    const isAllSelected = cartItems.length > 0 && selectedItemIds.size === cartItems.length;

    // Remove a specific ID from selection (e.g., when item deleted)
    const removeFromSelection = useCallback((itemId) => {
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });
    }, []);

    return {
        selectedItemIds,
        selectedCartItems,
        selectedItemTotal,
        selectedDeliveryFee,
        selectedTotal,
        toggleSelectItem,
        selectAll,
        isAllSelected,
        removeFromSelection,
        setSelectedItemIds, // expose if needed externally
    };
};