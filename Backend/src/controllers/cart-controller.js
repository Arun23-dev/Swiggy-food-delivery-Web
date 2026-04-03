const Cart = require('../models/cart');

// POST /api/cart/add
async function addToCart(req, res) {
    try {
        const { user, restaurant, items,totalAmount } = req.body; 

        const [item]=items;

        let cart = await Cart.findOne({ user: user });

        if (!cart) {
            cart = new Cart({
                user: user,
                restaurant: restaurant,
                items: [],
                totalAmount: 0
            });
        }

        const existingItem = cart.items.find(i => i.itemId === item.itemId); 

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item); 

        cart.totalAmount = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

        await cart.save();
        res.status(200).json({ success: true, cart });

    }
}
    catch(error){
        console.log(error);
    }
};

// GET /api/cart
async function getCart(req, res){
    try {
        const cart = await Cart.findOne(
            { user: req.body.user }
        );

        if (!cart) return res.status(404).json({ success: false, message: "Cart is empty" });

        res.status(200).json({ success: true, cart });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/cart/update/:itemId
const updateQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity ,user} = req.body;

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
        const { quantity ,user} = req.body;

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

module.exports = { addToCart, getCart, updateQuantity, removeItem, clearCart };