const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/user');
const Payment = require('../models/payment');
const crypto = require('crypto');
const {
    FREE_DELIVERY_THRESHOLD,
    DELIVERY_CHARGE
} = require('./../utils/constant');


// POST /api/orders/create
const createOrder = async (req, res) => {
    try {
        const userId = req.result._id;
        const {
            deliveryAddress,
            restaurants,
            paymentMode,
            deliveryFee: frontendDeliveryFee,
            itemTotal: frontendItemTotal,
            totalAmount: frontendTotalAmount
        } = req.body;



        // 1. Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 2. Validate restaurants and items
        if (!restaurants || restaurants.length === 0) {
            return res.status(400).json({ success: false, message: 'No restaurants selected' });
        }

        // 3. Find the delivery address from user's addresses
        const address = user.address.find(addr => addr._id.toString() === deliveryAddress._id);
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

        // 4. Build the restaurants array (matching schema) and calculate totals
        let calculatedItemTotal = 0;
        const formattedRestaurants = [];

        for (const rest of restaurants) {
            if (!rest.items || rest.items.length === 0) continue;

            const formattedItems = rest.items.map(item => ({
                swiggyItemId: item.swiggyItemId,
                name: item.name,
                price: Math.floor(item.price / 100),   // convert from paisa if needed
                quantity: item.quantity,
                image: item.image
            }));

            let restaurantSum = 0;
            for (const item of formattedItems) {
                restaurantSum += item.price * item.quantity;
            }

            formattedRestaurants.push({
                restaurantId: rest.restaurantId,
                restaurantName: rest.restaurantName,
                city: rest.city,
                locality: rest.locality,
                items: formattedItems,
                restaurantTotal: restaurantSum
            });

            calculatedItemTotal += restaurantSum;
        }

        // 5. Calculate delivery fee and total amount server-side
        const calculatedDeliveryFee = calculatedItemTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
        const calculatedTotalAmount = calculatedItemTotal + calculatedDeliveryFee;

        // 6. Validate frontend totals (prevent manipulation)
        if (frontendItemTotal !== calculatedItemTotal ||
            frontendDeliveryFee !== calculatedDeliveryFee ||
            frontendTotalAmount !== calculatedTotalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Amount mismatch. Please refresh and try again.',
                debug: {
                    server: { itemTotal: calculatedItemTotal, deliveryFee: calculatedDeliveryFee, total: calculatedTotalAmount },
                    client: { itemTotal: frontendItemTotal, deliveryFee: frontendDeliveryFee, total: frontendTotalAmount }
                }
            });
        }

        // 7. Create the order
        const order = await Order.create({
            user: userId,
            restaurants: formattedRestaurants,
            deliveryAddress: deliveryAddressDetails,
            status: 'placed',
            totalAmount: calculatedTotalAmount,
            itemTotal: calculatedItemTotal,
            deliveryFee: calculatedDeliveryFee,
        });

        // 8. Clear user's cart ✅ Fixed closing parenthesis
        await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    restaurants: [],
                    count: 0,
                    totalAmount: 0
                }
            },
            {
                upsert: true,
                new: true
            }
        ); // ✅ Added missing closing parenthesis

        // 9. Handle payment if esewa
        let transactionId = null;
        let payment;  // ✅ Declare once outside

        if (paymentMode === 'esewa') {
            transactionId = crypto.randomUUID();
            payment = new Payment({
                user: userId,
                order: order._id,
                amount: calculatedTotalAmount,
                method: 'esewa',
                status: 'pending',
                transactionId: transactionId,
                gatewayData: {},
            });
            await payment.save();
            order.payment = payment._id;
            await order.save();
        }
        else if (paymentMode === 'cod') {
            payment = new Payment({
                user: userId,
                order: order._id,
                amount: calculatedTotalAmount,
                method: 'cod',
                status: 'pending',  // Will be updated when cash collected
                transactionId: `cod_${order._id}`,
                gatewayData: {},
            });
            await payment.save();
            order.payment = payment._id;
            await order.save();
        }


        // 10. Send response
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: {
                _id: order._id,
                user: order.user,
                restaurants: order.restaurants,
                deliveryAddress: order.deliveryAddress,
                status: order.status,
                totalAmount: order.totalAmount,
                itemTotal: order.itemTotal,
                deliveryFee: order.deliveryFee,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            },
            summary: {
                itemTotal: `₹${calculatedItemTotal}`,
                deliveryFee: `₹${calculatedDeliveryFee}`,
                totalAmount: `₹${calculatedTotalAmount}`,
                freeDelivery: calculatedDeliveryFee === 0
            },
            ...(paymentMode === 'esewa' && { transactionId })
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

// ─────────────────────────────────────────
// 2. CANCEL ORDER
// PATCH /api/orders/:orderId/cancel
// ─────────────────────────────────────────────
const cancelOrder = async (req, res) => {
    try {
        const userId = req.result._id;
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // // ✅ Ownership check - UNCOMMENT THIS
        // if (order.user.toString() !== userId.toString()) {
        //     return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
        // }

        // // ✅ Only allow cancellation if order hasn't been delivered or already cancelled
        // const nonCancellableStatuses = ['delivered', 'cancelled'];
        // if (nonCancellableStatuses.includes(order.status)) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Cannot cancel order with status: ${order.status}`,
        //     });
        // }

        order.status = 'cancelled';
        order.cancellationReason = reason || 'Cancelled by user';

        await order.save();

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
        const userId = req.result._id; // ✅ Fixed: use req.result instead of req.user
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Ownership check
        // if (order.user.toString() !== userId.toString()) {
        //     return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
        // }

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
        const userId = req.result._id;

        const filter = { user: userId };
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        
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
// 6. UPDATE ORDER STATUS (admin/restaurant only)
// PATCH /api/orders/:orderId/status
// ─────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, estimatedDeliveryTime } = req.body;

        const validStatuses = ['placed', 'preparing', 'pickedUp', 'delivered', 'cancelled']; // ✅ fixed statuses
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Prevent going backwards in status
        const statusFlow = ['placed', 'preparing', 'pickedUp', 'delivered'];
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

        await order.save();

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


// Create reorder linked to parent order
const reorder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.result._id;
        const {restaurants,itemTotal,deliveryFee}=req.body;
    
        // 1. Verify original order
        const parentOrder = await Order.findById(orderId);
        if (!parentOrder) return res.status(404).json({ success: false, message: 'Original order not found' });
        if (parentOrder.user.toString() !== userId.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

        // 4. Create new order
        let totalAmount=itemTotal+deliveryFee
        const newOrder = await Order.create({
            user: userId,
            restaurants,
            deliveryAddress: parentOrder.deliveryAddress,
            deliveryFee: Number(deliveryFee || 0),
            status: "placed",
            isReoder: true,
            parentOrderId: parentOrder._id,
            totalAmount
        })
   
        // 5. Update parent order
        await Order.findByIdAndUpdate(orderId, {  
            $inc: { reOrderCount: 1 },            
            $push: {
                reorderHistory: {
                    reorderedOrderId: newOrder._id,
                    reorderedAt: new Date()
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Order recreated successfully',
            order: newOrder,
            parentOrderId: orderId,
            reorderCount: (parentOrder.reOrderCount || 0) + 1
        });

    } catch (error) {
        console.error('Create reorder error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
// ─────────────────────────────────────────────
// 8. GET ORDER BY TRANSACTION ID
// GET /api/orders/transaction/:transactionId
// ─────────────────────────────────────────────
const getOrderByTransactionId = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const payment = await Payment.findOne({ transactionId: transactionId }).populate('order');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found for this transaction' });
        }

        res.json(payment.order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createOrder,
    cancelOrder,
    getOrderById,
    getMyOrders,
    updateOrderStatus,
    reorder,
    getOrderByTransactionId
};