const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user');



// POST /api/orders/create
const createOrder = async (req, res) => {
    try {
        const userId = req.result._id;
        const { deliveryAddress, items, totalAmount } = req.body; // totalAmount is in rupees

       
        // console.log("Items:", items);
        // console.log("Delivery Address:", deliveryAddress);
        //  console.log("Total Amount (Rupees):", totalAmount);

        // Check user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check cart items
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Find address
        const address = user.address.find(add => add._id.toString() === deliveryAddress._id);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Delivery address not found' });
        }

        const deliveryAddressDetails = {
            addressId: address._id,
            label: address.label,
            street: address.street,
            city: address.city,
            pincode: address.pincode,
        };

        const formattedItems = items.map(item => ({
            itemId: item.itemId || item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));
        // console.log(formattedItems);

        const itemTotalInPaisa = formattedItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // console.log(itemTotalInPaisa)

        // Calculate delivery fee in PAISA
        const DELIVERY_CHARGE_PAISA = 6700; // 67 rupees
        const FREE_DELIVERY_THRESHOLD_PAISA = 100000; // 1000 rupees
        const deliveryFeeInPaisa = itemTotalInPaisa > FREE_DELIVERY_THRESHOLD_PAISA ? 0 : DELIVERY_CHARGE_PAISA;

        // Calculate total in PAISA
        const calculatedTotalInPaisa = itemTotalInPaisa + deliveryFeeInPaisa;
        const calculatedTotalInRupees = Math.floor(calculatedTotalInPaisa / 100);

        // console.log(calculatedTotalInRupees);

        if (totalAmount !== calculatedTotalInRupees) {
            return res.status(400).json({
                success: false,
                message: 'Total amount mismatch',
                details: {
                    itemTotal: `₹${((itemTotalInPaisa || 0) / 100).toFixed(2)}`,
                    deliveryFee: `₹${((deliveryFeeInPaisa || 0) / 100).toFixed(2)}`,
                    expectedTotal: `₹${(calculatedTotalInRupees || 0).toFixed(2)}`,
                    receivedTotal: `₹${(totalAmount || 0).toFixed(2)}`
                }
            });
        }

        console.log("✅ Validation passed!");
   
        const order = await Order.create({
            user: userId,
            items: formattedItems,
            deliveryAddress: deliveryAddressDetails,
            status: 'placed',
            totalAmount: calculatedTotalInPaisa,
            itemTotal: itemTotalInPaisa,
            deliveryFee: deliveryFeeInPaisa
        });

        console.log("Order created successfully:", order._id);

        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
        );

        // Safely convert values for response
        const safeToRupees = (value) => {
            return value ? value / 100 : 0;
        };

        // Send response (convert back to rupees for frontend)
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: {
                _id: order._id,
                user: order.user,
                items: order.items,
                deliveryAddress: order.deliveryAddress,
                status: order.status,
                totalAmount: safeToRupees(order.totalAmount),
                itemTotal: safeToRupees(order.itemTotal),
                deliveryFee: safeToRupees(order.deliveryFee),
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            },
            summary: {
                itemTotal: `₹${((itemTotalInPaisa || 0) / 100).toFixed(2)}`,
                deliveryFee: `₹${((deliveryFeeInPaisa || 0) / 100).toFixed(2)}`,
                totalAmount: `₹${((calculatedTotalInPaisa || 0) / 100).toFixed(2)}`,
                freeDelivery: deliveryFeeInPaisa === 0
            }
        });

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
// ─────────────────────────────────────────────
// 2. CANCEL ORDER
// PATCH /api/orders/:orderId/cancel
// ─────────────────────────────────────────────
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(orderId);

        // ── Order existence check ──
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // ── Ownership check: user can only cancel their own order ──
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
        }

        // ── Only allow cancellation if order hasn't been picked up yet ──
        const nonCancellableStatuses = ['out-for-delivery', 'delivered', 'cancelled'];
        if (nonCancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order with status: ${order.status}`,
            });
        }

        order.status = 'cancelled';
        order.cancellationReason = reason || 'Cancelled by user';
        await order.save();                               // triggers pre('save') middleware

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order,
        });

    } catch (error) {
        console.error('cancelOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// ─────────────────────────────────────────────
// 3. GET SINGLE ORDER BY ID
// GET /api/orders/:orderId
// ─────────────────────────────────────────────
const getOrderById = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // ── Ownership check ──
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error('getOrderById error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// ─────────────────────────────────────────────
// 4. GET MY ORDERS (logged-in user's order history)
// GET /api/orders/my-orders
// ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        // ── Optional: filter by status via query param ──
        // e.g. GET /api/orders/my-orders?status=delivered
        const filter = { user: userId };
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        console.error('getMyOrders error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// ─────────────────────────────────────────────
// 6. UPDATE ORDER STATUS  (admin/restaurant only)
// PATCH /api/orders/:orderId/status
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, estimatedDeliveryTime } = req.body;

        const validStatuses = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // ── Prevent going backwards in status ──
        const statusFlow = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'];
        const currentIdx = statusFlow.indexOf(order.status);
        const newIdx = statusFlow.indexOf(status);

        if (newIdx !== -1 && currentIdx !== -1 && newIdx < currentIdx) {
            return res.status(400).json({
                success: false,
                message: `Cannot move status backwards from '${order.status}' to '${status}'`,
            });
        }

        order.status = status;
        if (estimatedDeliveryTime) order.estimatedDeliveryTime = estimatedDeliveryTime;

        await order.save();                               // triggers pre('save') → sets deliveredAt if delivered

        res.status(200).json({
            success: true,
            message: `Order status updated to '${status}'`,
            order,
        });

    } catch (error) {
        console.error('updateOrderStatus error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// ─────────────────────────────────────────────
// 7. REORDER  (re-create a past order)
// POST /api/orders/:orderId/reorder
// ─────────────────────────────────────────────
const reorder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { orderId } = req.params;

        const pastOrder = await Order.findById(orderId);

        if (!pastOrder) {
            return res.status(404).json({ success: false, message: 'Original order not found' });
        }

        if (pastOrder.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // ── Create a fresh order from the past one ──
        const newOrder = new Order({
            user: userId,
            items: pastOrder.items,
            deliveryAddress: pastOrder.deliveryAddress,
            totalAmount: pastOrder.totalAmount,
            status: 'placed',
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed again successfully',
            order: newOrder,
        });

    } catch (error) {
        console.error('reorder error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


module.exports = {
    createOrder,
    cancelOrder,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
    reorder,
};