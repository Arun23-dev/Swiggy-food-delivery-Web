
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        maxLength: 30,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 5,
        max: 80,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    password: {
        type: String,
        required: true,
    },
    image: [{
        data: Buffer,
        contentType: String,
    }],
    address: [{
        label: String,
        street: String,
        city: String,
        pincode: String,
        isDefault: { type: Boolean, default: false },
    },],
    isActive: { type: Boolean, default: true },

},
    {
        timestamps: true,
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;