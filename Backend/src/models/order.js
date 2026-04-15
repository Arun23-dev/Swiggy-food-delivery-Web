const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    items: [
        {
            itemId: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min:0,

            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            image: {
                type: String,
                required: true,
            }


        }
    ],
    deliveryAddress: {
        addressId: {
            type: Schema.Types.ObjectId,
            ref: 'User.address'
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
            required: true
        },
        pincode: {
            type: String,
            required: true
        },

    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    itemTotal: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
        default: null,
    },
    status: {
        type: String,
        enum: [
            'placed',
            'confirmed',
            'preparing',
            'out-for-delivery',
            'delivered',
            'cancelled'
        ],
        default: 'placed'
    },
    estimatedDeliveryTime: {
        type: Date
    },
    cancellationReason: {
        type: String,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    },

},
    {
        timestamps: true
    });

orderSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'delivered') {
        this.deliveredAt = new Date();
    }
    // Clear cancellationReason if order is not cancelled
    if (this.isModified('status') && this.status !== 'cancelled') {
        this.cancellationReason = null;
    }
    next();
});
orderSchema.pre('validate', function(next) {
    if (this.totalAmount !== this.itemTotal + this.deliveryFee) {
        next(new Error('Total amount must equal item total plus delivery fee'));
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;