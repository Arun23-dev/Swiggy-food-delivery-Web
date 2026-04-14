const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartSchema = new mongoose.Schema({

    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            itemId: String,
            name: String,
            price: Number,
            quantity:
            {
                type: Number,
                default: 1
            },
            image: String
        }
    ],
    totalAmount: {
        type: Number,
        default: 0,
    },
    count: {
        type: Number,
        default: 0,
    }

    },
    {
        timestamps: true
    }
)
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;