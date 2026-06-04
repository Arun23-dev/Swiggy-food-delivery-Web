const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    restaurants: [
        {
            restaurantId: {
                type: String,
                required: true,
            },
            restaurantName: {
                type: String,
                required: true,
            },
            city: String,
            locality: String,
            items: [
                {
                    swiggyItemId: {
                        type: String,
                        required: true,
                    },
                    name: String,
                    price: Number,
                    quantity: {
                        type: Number,
                        default: 1
                    },
                    image: String
                }
            ]
        }
    ],
    count: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
     versionKey: false  
});

cartSchema.pre('save', function(next) {
    // 'this' refers to the document directly
    this.count = this.restaurants.reduce((total, restaurant) => {
        return total + restaurant.items.reduce((sum, item) => {
            return sum + item.quantity;
        }, 0);
    }, 0);

    this.totalAmount = this.restaurants.reduce((total, restaurant) => {
        return total + restaurant.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }, 0);

    next();
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
