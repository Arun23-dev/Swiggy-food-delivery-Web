// components/CartComponent.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    addItem, 
    increaseItem, 
    decreaseItem, 
    removeItem, 
    clearCart,
    addItemToBackend,
    updateItemInBackend,
    removeItemFromBackend,
    syncCartAfterLogin,
    fetchCartFromBackend
} from '../features/cart/cartSlice';

const CartComponent = () => {
    const dispatch = useDispatch();
    const { items, count, loading, synced } = useSelector(state => state.cart);
    const { isAuthenticated, user } = useSelector(state => state.user);
    
    // Load cart based on auth status
    useEffect(() => {
        if (isAuthenticated && user) {
            // User is logged in - fetch from backend
            dispatch(fetchCartFromBackend(user.id));
        } else {
            // Guest user - cart already loaded from localStorage in initialState
            console.log('Guest cart loaded from localStorage');
        }
    }, [isAuthenticated, user, dispatch]);
    
    // Auto-sync local changes to backend when user is logged in
    useEffect(() => {
        if (!synced && isAuthenticated && user && items.length > 0) {
            // Debounce sync to avoid too many API calls
            const syncTimeout = setTimeout(() => {
                syncCartToBackend();
            }, 2000);
            
            return () => clearTimeout(syncTimeout);
        }
    }, [synced, isAuthenticated, user, items]);
    
    const syncCartToBackend = async () => {
        try {
            // Sync each item individually or batch sync
            for (const item of items) {
                await dispatch(addItemToBackend({
                    userId: user.id,
                    product: item
                })).unwrap();
            }
        } catch (error) {
            console.error('Failed to sync cart:', error);
        }
    };
    
    const handleAddToCart = (product) => {
        // 1. Update local state immediately (UI updates instantly)
        dispatch(addItem(product));
        
        // 2. If user is logged in, sync with backend
        if (isAuthenticated && user) {
            dispatch(addItemToBackend({
                userId: user.id,
                product
            }));
        }
        // If guest, cart is already saved to localStorage
    };
    
    const handleUpdateQuantity = (item, newQuantity) => {
        if (newQuantity > item.quantity) {
            dispatch(increaseItem({ id: item.id }));
        } else if (newQuantity < item.quantity) {
            dispatch(decreaseItem({ id: item.id }));
        }
        
        // Sync with backend if logged in
        if (isAuthenticated && user) {
            dispatch(updateItemInBackend({
                userId: user.id,
                itemId: item.id,
                quantity: newQuantity
            }));
        }
    };
    
    const handleRemoveItem = (itemId) => {
        dispatch(removeItem({ id: itemId }));
        
        if (isAuthenticated && user) {
            dispatch(removeItemFromBackend({
                userId: user.id,
                itemId
            }));
        }
    };
    
    if (loading) {
        return <div className="text-center py-8">Loading cart...</div>;
    }
    
    return (
        <div className="cart-container">
            <h2 className="text-2xl font-bold mb-4">Your Cart ({count} items)</h2>
            
            {!synced && (
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded mb-4 text-sm">
                    Syncing your cart...
                </div>
            )}
            
            {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                </div>
            ) : (
                <>
                    {items.map(item => (
                        <div key={item.id} className="cart-item border-b py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">NPR {item.price}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 ml-4"
                                    >
                                        Remove
                                    </button>
                                </div>
                                
                                <div className="font-semibold">
                                    NPR {item.price * item.quantity}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total:</span>
                            <span>NPR {items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
                        </div>
                        
                        <button
                            onClick={() => {/* Proceed to checkout */}}
                            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartComponent;