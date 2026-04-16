const Cart = require('../models/cart');

// POST /api/cart/add
async function addToCart(req, res) {
    try {
   
        const { user, restaurant, items, totalAmount } = req.body;

        const [item] = items;

        let cart = await Cart.findOne({ user: user });

        if (!cart) {
            cart = new Cart({
                user: user,
                restaurant: restaurant,
                items: [],
                totalAmount: 0
            });
        }

        const existingItem = cart.items?.find(i => i.itemId === item.itemId);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item);

            cart.totalAmount = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

            await cart.save();
            res.status(200).json({ success: true, cart });

        }
    }
    catch (error) {
       
    
    }
};

// GET /api/cart
async function getCart(req, res) {
    try {
        const { userId } = req.params
        const cart = await Cart.findById(userId);

        if (!cart) {
            return
            res.status(404).json({ success: false, message: "Cart is empty" });
        }
        res.status(200).json({ success: true, cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/cart/update/:itemId
const updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity, user } = req.body;

        const cart = await Cart.findOne({ user: user });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.find(item => item.itemId === itemId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (quantity <= 0) {
            // if quantity 0 just remove the item
            cart.items = cart.items.filter(item => item.itemId !== itemId);
        } else {
            item.quantity = quantity;
        }

        // recalculate total
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();
        res.status(200).json({ success: true, cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/cart/remove/:itemId
const removeItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity, user } = req.body;

        const cart = await Cart.findOne({ user: user });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.itemId !== itemId);

        // recalculate total
        cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();
        res.status(200).json({ success: true, message: "Item removed", cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user.id });
        res.status(200).json({ success: true, message: "Cart cleared" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const syncCart = async (req, res) => {
    try {
       
        const { userId, localCart } = req.body;

        if (Object.keys(localCart).length===0) {

            let dbCart = await Cart.findOne({ user: userId });
            

            return res.json({
                success: true,
                message: 'Data send fro the cart of the user',
                cart: {
                    items: dbCart.items,
                    count: dbCart.count,
                    totalAmount: dbCart.totalAmount
                }
            });


        }
        let userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            // Calculate totals for new cart
            const items = localCart?.items.map(item => ({
                itemId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || null
            }));

            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Create new cart
            userCart = new Cart({
                user: userId,
                items: items,
                count: count,
                totalAmount: totalAmount
            });

            await userCart.save();

            // ✅ Return FRESH data from database
            const freshCart = await Cart.findOne({ user: userId }).lean();

            return res.json({
                success: true,
                message: 'New cart created with guest items',
                cart: {
                    items: freshCart.items,
                    count: freshCart.count,
                    totalAmount: freshCart.totalAmount
                }
            });
        }

        //  If cart exists in DB but is EMPTY
        if (userCart.items.length === 0 && localCart.items.length > 0) {
        
            // Add all guest items
            userCart.items = localCart.items.map(item => ({
                itemId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || null
            }));

            // Recalculate totals
            userCart.count = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
            userCart.totalAmount = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await userCart.save();

            //  Return fresh data
            const freshCart = await Cart.findOne({ user: userId }).lean();

            return res.json({
                success: true,
                message: 'Empty cart updated with guest items',
                cart: {
                    items: freshCart.items,
                    count: freshCart.count,
                    totalAmount: freshCart.totalAmount
                }
            });
        }

        //  MERGE LOGIC using HashMap
        const itemLookup = {};

        // Index existing items
        userCart.items.forEach(item => {
            itemLookup[item.itemId] = item;
        });

        let hasChanges = false;

        // Merge guest items
        for (const guestItem of localCart.items) {
            if (itemLookup[guestItem.id]) {
                // Update existing
                const oldQuantity = itemLookup[guestItem.id].quantity;
                itemLookup[guestItem.id].quantity += guestItem.quantity;
                if (oldQuantity !== itemLookup[guestItem.id].quantity) {
                    hasChanges = true;
                }
            } else {
                // Add new item
                const newItem = {
                    itemId: guestItem.id,
                    name: guestItem.name,
                    price: guestItem.price,
                    quantity: guestItem.quantity,
                    image: guestItem.image || null
                };
                userCart.items.push(newItem);
                itemLookup[guestItem.id] = newItem;
                hasChanges = true;
            }
        }

        //  Only save if there are changes
        if (hasChanges) {
            
            userCart.count = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
            userCart.totalAmount = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            await userCart.save();

            console.log('Cart merged and saved successfully');
        }
         else {
            console.log('No changes detected, skipping save');
        }

        //  ALWAYS return FRESH data from database (avoid cache)
        const freshCart = await Cart.findOne({ user: userId }).lean();

        res.json({
            success: true,
            message: 'Cart synced successfully',
            cart: {
                items: freshCart.items,
                count: freshCart.count,
                totalAmount: freshCart.totalAmount
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Failed to sync cart',
            error: error.message
        });
    }
};
module.exports = { addToCart, getCart, updateQuantity, removeItem, clearCart, syncCart };