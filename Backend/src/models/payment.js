const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({

    // ref
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    method: {
        type: String,
        enum: ['esewa', 'khalti', 'cod', 'card'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    transactionId: {
        type: String,
        default: null,
        unique: true,  // Consider adding unique constraint
        index: true    // Add index for faster lookups
    },
    gatewayData: {
        pidx: { type: String },      // Payment ID from gateway
        mobile: { type: String },     // User's mobile for verification
        amount: { type: Number },     // Verified amount
        statusCode: { type: String }, // Gateway status
    },
    paidAt: {
        type: Date,
        default: null,

    },
    failedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
}
);
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;