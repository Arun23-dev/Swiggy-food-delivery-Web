const Order=require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user');



// POST /api/orders/create
const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;                      // from auth middleware
        const { deliveryAddressId, items, totalAmount } = req.body;

        // ── Validate user exists ──
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // ── Validate items ──
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // ── Find and snapshot the selected address ──
        const address = user.address.id(deliveryAddressId);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Delivery address not found' });
        }

        // ── Snapshot address at order time (so future edits don't affect this order) ──
        const deliveryAddress = {
            addressId: address._id,
            label: address.label,
            street: address.street,
            city: address.city,
            pincode: address.pincode,
        };

        // ── Create order ──
        const order = new Order({
            user: userId,
            items,
            deliveryAddress,
            totalAmount,
            status: 'placed',
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order,
        });

    } catch (error) {
        console.error('createOrder error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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