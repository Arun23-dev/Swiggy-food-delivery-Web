// hooks/useCartSelection.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "../Utils/Constants";

export const useCartSelection = (restaurants = []) => {
    // Flatten all items with restaurant info
    const cartItems = useMemo(() => {
        if (!Array.isArray(restaurants)) return [];
        return restaurants.flatMap((restaurant) =>
            (restaurant.items || []).map((item) => ({
                ...item,
                restaurantId: restaurant.restaurantId,
                restaurantName: restaurant.restaurantName,
                city: restaurant.city,
                locality: restaurant.locality,
            }))
        );
    }, [restaurants]);

    const [selectedItemKeys, setSelectedItemKeys] = useState(new Set());

    const getItemKey = useCallback(
        (item) => `${item.restaurantId}_${item.swiggyItemId}`,
        []
    );

    // Auto-select all on first load
    useEffect(() => {
        if (cartItems.length === 0) return;
        setSelectedItemKeys((prev) => (prev.size > 0 ? prev : new Set(cartItems.map(getItemKey))));
    }, [cartItems, getItemKey]);

    // Remove keys that no longer exist
    useEffect(() => {
        const existingKeys = new Set(cartItems.map(getItemKey));
        setSelectedItemKeys((prev) => {
            const filtered = new Set([...prev].filter((k) => existingKeys.has(k)));
            return filtered.size === prev.size ? prev : filtered;
        });
    }, [cartItems, getItemKey]);

    const selectedCartItems = useMemo(
        () => cartItems.filter((item) => selectedItemKeys.has(getItemKey(item))),
        [cartItems, selectedItemKeys, getItemKey]
    );

    const selectedItemTotal = useMemo(
        () =>
            selectedCartItems.reduce(
                (sum, item) => sum + Math.floor((item.defaultPrice || item.price || 0) / 100) * item.quantity,
                0
            ),
        [selectedCartItems]
    );

    const selectedDeliveryFee = selectedItemTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const selectedTotal = selectedItemTotal + selectedDeliveryFee;

    const toggleSelectItem = useCallback((itemKey) => {
        setSelectedItemKeys((prev) => {
            const next = new Set(prev);
            next.has(itemKey) ? next.delete(itemKey) : next.add(itemKey);
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedItemKeys((prev) =>
            prev.size === cartItems.length ? new Set() : new Set(cartItems.map(getItemKey))
        );
    }, [cartItems, getItemKey]);

    const isAllSelected = cartItems.length > 0 && selectedItemKeys.size === cartItems.length;

    const removeFromSelection = useCallback((itemKey) => {
        setSelectedItemKeys((prev) => {
            const next = new Set(prev);
            next.delete(itemKey);
            return next;
        });
    }, []);

    // ✅ The key part: group selected items into restaurants array (matches backend schema)
    const groupedSelectedRestaurants = useMemo(
        () =>
            restaurants
                .map((restaurant) => ({
                    restaurantId: restaurant.restaurantId,
                    restaurantName: restaurant.restaurantName,
                    city: restaurant.city,
                    locality: restaurant.locality,
                    items: restaurant.items.filter((item) =>
                        selectedItemKeys.has(`${restaurant.restaurantId}_${item.swiggyItemId}`)
                    ),
                }))
                .filter((r) => r.items.length > 0),
        [restaurants, selectedItemKeys]
    );

    return {
        cartItems,
        selectedItemKeys,
        selectedCartItems,
        groupedSelectedRestaurants,
        selectedItemTotal,
        selectedDeliveryFee,
        selectedTotal,
        toggleSelectItem,
        selectAll,
        isAllSelected,
        removeFromSelection,
        setSelectedItemKeys,
    };
};