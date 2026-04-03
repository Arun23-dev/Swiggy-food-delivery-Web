const mongoose = require('mongoose');
const { Schema } = mongoose;
const orderSchema = new mongoose.Schema({

    cart: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resturant: {
        resturantId: String,
        resturantName: String,
    },
    items: [
        {
            itemId: String,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    deliveryAddress: {
        street: String,
        city: String,
        pincode: String,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'placed'
    },
    payment: {
        method: {
            type: String,
            enum: ['esewa', 'cod'],
            defalut: 'cod'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded',],
            default: 'pending',
        },
        esewaPaymentId: String,
        esewaOrderId: String
    }
},

    {
        timestamps: true
    }
)
const Order = mongoose.model("Order", orderSchema);
module.exports=Order;