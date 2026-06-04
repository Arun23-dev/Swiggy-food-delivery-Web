// Backend/src/controllers/cart-controller.js
const Cart = require("../models/cart");
const getFormattedCart = require('../utils/getFormattedCart')
// Get cart by user ID
const getCart = async (req, res) => {
    try {

        const userId = req.result._id;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = {
                restaurants: [],
                count: 0,
                totalAmount: 0,
            };
        }

        res.json({
            success: true,
            cart: {
                restaurants: cart.restaurants,
                count: cart.count,
                totalAmount: cart.totalAmount,
            },
        });
    } catch (error) {
        console.error("Get cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get cart",
            error: error.message,
        });
    }
};

// Update item quantity
const updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;

        const { quantity, restaurantId } = req.body;
        const userId = req.result._id;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const restaurant = cart.restaurants.find(
            (r) => r.restaurantId === restaurantId,
        );

        if (restaurant) {
            const item = restaurant.items.find((i) => i.swiggyItemId === itemId);

            if (item) {
                if (quantity <= 0) {
                    // Remove item
                    restaurant.items = restaurant.items.filter(
                        (i) => i.swiggyItemId !== itemId,
                    );

                    // Remove restaurant if empty
                    if (restaurant.items.length === 0) {
                        cart.restaurants = cart.restaurants.filter(
                            (r) => r.restaurantId !== restaurantId,
                        );
                    }
                } else {
                    item.quantity = quantity;
                }

                await cart.save();
            }
        }
        res.json({
            success: true,
            message: "Quantity updated",
            cart: {
                restaurants: cart.restaurants,
                count: cart.count,
                totalAmount: cart.totalAmount,
            },
        });
    } catch (error) {
        console.error("Update quantity error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update quantity",
            error: error.message,
        });
    }
};
// remove item form the cart 
const removeSelectedItem = async (req, res) => {
    try {
        const { items } = req.body;
      
        const userId = req.result._id;

        // Step 1: Pull items per restaurant
        for (const { restaurantId, itemIds } of items) {
            await Cart.updateOne(
                { user: userId },
                {
                    $pull: {
                        "restaurants.$[r].items": { swiggyItemId: { $in: itemIds } }
                    }
                },
                { arrayFilters: [{ "r.restaurantId": restaurantId }] }
            );
        }

        // Step 2: Clean empty/corrupt restaurants
        await Cart.updateOne(
            { user: userId },
            {
                $pull: {
                    restaurants: {
                        $or: [
                            { items: { $size: 0 } },
                            { restaurantId: { $exists: false } },
                            { restaurantName: { $exists: false } }
                        ]
                    }
                }
            }
        );

        // Step 3: Fetch, recalculate, save
        const cart = await Cart.findOne({ user: userId });

        await cart.save(); // triggers pre('save') → recalculates count + totalAmount

        res.json({
            success: true,
            message: "Item removed",
            cart: getFormattedCart(cart),
        });

    } catch (error) {
        console.error("Remove item error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.result._id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                restaurants: [],
                count: 0,
                totalAmount: 0,
            },
            { new: true, upsert: true },
        );

        res.json({
            success: true,
            message: "Cart cleared",
            cart: {
                restaurants: [],
                count: 0,
                totalAmount: 0,
            },
        });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message,
        });
    }
};
const syncCart = async (req, res) => {
    try {
        const { syncType, localCart } = req.body;

        const userId = req.result._id;

        // Helper to compute count & totalAmount from restaurants array

        const computeCartTotals = (restaurants) => {
            let count = 0;
            let totalAmount = 0;
            for (const rest of restaurants) {
                for (const item of rest.items) {
                    count += item.quantity;
                    totalAmount += item.price * item.quantity;
                }
            }
            return { count, totalAmount };
        };

        // Helper to prepare restaurants data (ensures correct fields)
        const prepareRestaurants = (cartData) => {
            return (cartData?.restaurants || []).map((r) => ({
                restaurantId: r.restaurantId,
                restaurantName: r.restaurantName,
                restaurantImage: r.restaurantImage || "",
                city: r.city || "",
                locality: r.locality || "",
                items: (r.items || []).map((i) => ({
                    swiggyItemId: i.swiggyItemId,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                })),
            }));
        };

        // ==================== RECONCILE (local wins completely) ====================
        if (syncType === "reconcile") {
            const finalRestaurants = prepareRestaurants(localCart);
            const { count, totalAmount } = computeCartTotals(finalRestaurants);
            const updatedCart = await Cart.findOneAndUpdate(
                { user: userId },
                { $set: { restaurants: finalRestaurants, count, totalAmount } },
                { upsert: true, new: true }
            );
            return res.json({
                success: true,
                message: "Cart reconciled (local replaces DB)",
                cart: {
                    restaurants: updatedCart.restaurants,
                    count: updatedCart.count,
                    totalAmount: updatedCart.totalAmount,
                },
            });
        }

        // ==================== MERGE (local items win, keep DB metadata) ====================
        let dbCart = await Cart.findOne({ user: userId });
        const localRestaurants = localCart?.restaurants || [];

        // Case: no DB cart and no local items
        if (!dbCart && localRestaurants.length === 0) {
            const { count, totalAmount } = computeCartTotals([]);
            const emptyCart = await Cart.findOneAndUpdate(
                { user: userId },
                { $set: { restaurants: [], count, totalAmount } },
                { upsert: true, new: true }
            );
            return res.json({
                success: true,
                message: "No cart data",
                cart: {
                    restaurants: emptyCart.restaurants,
                    count: emptyCart.count,
                    totalAmount: emptyCart.totalAmount,
                },
            });
        }

        // Case: no DB cart but local has items – create from local
        if (!dbCart) {
            const finalRestaurants = prepareRestaurants(localCart);
            const { count, totalAmount } = computeCartTotals(finalRestaurants);
            const newCart = await Cart.findOneAndUpdate(
                { user: userId },
                { $set: { restaurants: finalRestaurants, count, totalAmount } },
                { upsert: true, new: true }
            );
            return res.json({
                success: true,
                message: "Cart created from local",
                cart: {
                    restaurants: newCart.restaurants,
                    count: newCart.count,
                    totalAmount: newCart.totalAmount,
                },
            });
        }

        // DB cart exists → merge local items
        const mergedRestaurants = [...dbCart.restaurants];

        for (const localRest of localRestaurants) {
            const existingIndex = mergedRestaurants.findIndex(
                (r) => r.restaurantId === localRest.restaurantId
            );
            if (existingIndex !== -1) {
                const dbItems = mergedRestaurants[existingIndex].items;
                for (const localItem of localRest.items) {
                    const itemIndex = dbItems.findIndex(
                        (i) => i.swiggyItemId === localItem.swiggyItemId
                    );
                    if (itemIndex !== -1) {
                        dbItems[itemIndex].quantity = localItem.quantity;
                    } else {
                        dbItems.push(localItem);
                    }
                }
                mergedRestaurants[existingIndex] = {
                    ...mergedRestaurants[existingIndex],
                    restaurantName:
                        localRest.restaurantName ||
                        mergedRestaurants[existingIndex].restaurantName,
                    city: localRest.city || mergedRestaurants[existingIndex].city,
                    locality:
                        localRest.locality || mergedRestaurants[existingIndex].locality,
                    items: dbItems,
                };
            } else {
                mergedRestaurants.push({
                    restaurantId: localRest.restaurantId,
                    restaurantName: localRest.restaurantName,
                    restaurantImage: localRest.restaurantImage || "",
                    city: localRest.city || "",
                    locality: localRest.locality || "",
                    items: localRest.items,
                });
            }
        }

        // Compute totals from the merged array and update atomically
        const { count, totalAmount } = computeCartTotals(mergedRestaurants);
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { restaurants: mergedRestaurants, count, totalAmount } },
            { new: true } // Cart exists, no upsert needed
        );

        return res.json({
            success: true,
            message: "Cart merged (local wins)",
            cart: {
                restaurants: updatedCart.restaurants,
                count: updatedCart.count,
                totalAmount: updatedCart.totalAmount,
            },
        });
    } catch (error) {
        console.error("Sync cart error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to sync cart",
            error: error.message,
        });
    }
};
// Make sure to export only the functions (no extra code)
module.exports = {
    getCart,
    updateQuantity,
    removeSelectedItem,
    clearCart,
    syncCart,
};
