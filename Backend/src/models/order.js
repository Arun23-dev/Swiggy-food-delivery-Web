const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
        restaurants: [
            {
                restaurantName: {
                    type: String,
                    required: true,
                },
                restaurantId: {
                    type: String,
                    required: true,
                },
                city: { type: String, required: true },
                locality: { type: String, required: true },
                items: [
                    // ✅ each restaurant has its own items
                    {
                        swiggyItemId: { type: String, required: true },
                        name: { type: String, required: true },
                        price: { type: Number, required: true, min: 0 },
                        quantity: { type: Number, required: true, min: 1, default: 1 },
                        image: { type: String, required: true },
                    },
                ],

                restaurantTotal: { type: Number, default: 0 },
            },
        ],
        deliveryAddress: {
            addressId: {
                type: Schema.Types.ObjectId,
                ref: "User.address",
            },
            label: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            },
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        itemTotal: {
            type: Number,
            required: true,
            default: 0,
        },
        deliveryFee: {
            type: Number,
            required: true,
            default: 0,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },
        status: {
            type: String,
            enum: ["placed", "preparing", "pickedUp", "delivered", "cancelled"],
            default: "placed",
        },
        estimatedDeliveryTime: {
            type: Date,
        },
        cancellationReason: {
            type: String,
            default: null,
        },
        deliveredAt: {
            type: Date,
            default: null,
        },

        isReoder: {
            type: Boolean,
            default: false,
        },
        parentOrderId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Order',
            default: null,
        },
        reOrderCount: {
            type: Number,
            default: 0,
        },
        reorderHistory: [
            {

                reorderedOrderId:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Order'
                },
                reorderedAt: { type: Date, default: Date.now }
            }],
        
    },
    {
        timestamps: true,
    },
);

orderSchema.pre("save", function (next) {
    // 1. Handle status changes
    if (this.isModified("status") && this.status === "delivered") {
        this.deliveredAt = new Date();
    }
    if (this.isModified("status") && this.status !== "cancelled") {
        this.cancellationReason = null;
    }

    // 2. Calculate totals across all restaurants
    let totalItemSum = 0;

    for (let restaurant of this.restaurants) {
        let restaurantSum = 0;
        for (let item of restaurant.items) {
            restaurantSum += item.price * item.quantity;
        }
        restaurant.restaurantTotal = restaurantSum; // store per-restaurant total
        totalItemSum += restaurantSum;
    }

    this.itemTotal = totalItemSum;

    // 3. Total amount (add platformFee only if you have it in schema)
    // If you don't have platformFee, just do:
    this.totalAmount = this.itemTotal + (this.deliveryFee || 0);
    // Or if you add platformFee field:
    // this.totalAmount = this.itemTotal + this.deliveryFee + (this.platformFee || 0);

    next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
