const User = require('../models/user');
const validate = require('../utils/validate');
const redisClient = require('../config/redis');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const isProduction = process.env.NODE_ENV === 'production';

const register = async (req, res) => {
    try {

        // validate(req.body); // function call for the validation 

        const firstName = req.body.name.trim().split(" ")[0];
        const emailId = req.body.email;
        const password = req.body.password;


        const saltRounds = 5;

        const password1 = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            firstName: firstName,
            emailId: emailId,
            password: password1
        });

        const token = jwt.sign(
            {
                _id: newUser._id,
                emailId: emailId,
                role: 'user'
            },
            process.env.JWT_KEY,
            { expiresIn: 7 * 24 * 60 * 60  }
        );

        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? 'None' : 'Lax',  // ← This fixes SENDING
            secure: isProduction,                      // ← Required with None
            path: '/'
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                emailId: newUser.emailId,
                role: 'user',
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });

    } catch (err) {
        res.status(400).json({
            message: "User registration failed",
            error: err.message
        });
    }
}

const login = async (req, res) => {
    try {

        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new Error("Invalid credentials");
        }

        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 7 * 24 * 60 * 60 }
        );

        res.cookie('token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: isProduction ? 'None' : 'Lax',  // ← This fixes SENDING
            secure: isProduction,                      // ← Required with None
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                emailId: user.emailId,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            },
        });

    } catch (err) {

        res.status(400).json({
            message: "User login failed",
            error: err.message || "Unknown error occurred"
        });
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: isProduction ? 'None' : 'Lax',  // ← MUST match login
            secure: isProduction,                      // ← MUST match login
            path: '/'
        });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (err) {
        res.status(500).json({
            message: "Logout failed",
            error: err.message || "Something went wrong"
        });
    }
}
const checkAuth = async (req, res) => {
    try {
        const user = req.result;
        res.status(200).json({
            success: true,
            isAuthenticated: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                address: user.address,
                isActive: user.isActive
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            isAuthenticated: false,
            message: "Authentication check failed",
            error: err.message || "Something went wrong"
        });
    }
}
// Add Address
const addAddress = async (req, res) => {
    try {

        const { label, street, city, pincode } = req.body;
        let isDefault = req.body?.isDefault || false;
        const userId = req.result._id;

        if (!label || !street || !city || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode || pincode must be of 6 digit'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (isDefault) {
            user.address.forEach(addr => {
                addr.isDefault = false;
            });
        }
        await user.save();

        const newAddress = {
            label,
            street,
            city,
            pincode,
            isDefault: isDefault ?? user.address.length === 0
        };

        user.address.push(newAddress);
        await user.save();

        // Get the added address with its auto-generated _id
        const updatedUser = await User.findById(userId);
        const allAddress = updatedUser.address;

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: {
                allAddress
            } // This includes the _id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// 2. GET ALL ADDRESSES
const getAddresses = async (req, res) => {
    try {
        // Step 1: Get user ID from middleware
        const userId = req.result._id;

        // Step 2: Find all addresses for this user
        const addresses = await User.findById(userId).address.sort({ isDefault: -1, createdAt: -1 });

        // Step 3: Check if addresses exist
        if (!addresses || addresses.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No addresses found',
                data: [],
                count: 0
            });
        }

        // Step 4: Send success response
        return res.status(200).json({
            success: true,
            message: 'Addresses fetched successfully',
            count: addresses.length,
            data: addresses
        });

    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
const updateAddress = async (req, res) => {
    try {
       
        const { addressId } = req.params;
        const userId = req.result._id;
        const { label, street, city, pincode, isDefault } = req.body;

        // Validate pincode first
        if (pincode && !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pincode. Must be 6 digits",
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "address._id": addressId },
            {
                $set: {
                    "address.$.label": label,
                    "address.$.street": street,
                    "address.$.city": city,
                    "address.$.pincode": pincode,
                    "address.$.isDefault": isDefault,
                },
            },
            { new: true }
        );
      
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: updatedUser.address,
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}
// 4. DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {

        const { addressId } = req.params;
        const userId = req.result._id;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Find address before deleting
        const addressToDelete = user.address.find(
            (addr) => addr._id.toString() === addressId
        );

        if (!addressToDelete) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const wasDefault = addressToDelete.isDefault;
        // Delete address
        const result = await User.updateOne(
            { _id: userId },
            {
                $pull: {
                    address: {
                        _id: addressId
                    }
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }
        // If deleted address was default,
        // make first remaining address default
        if (wasDefault) {
            const updatedUser = await User.findById(userId);
            if (
                updatedUser.address.length > 0 &&
                !updatedUser.address.some((addr) => addr.isDefault)
            ) {
                updatedUser.address[0].isDefault = true;
                await updatedUser.save();
            }
        }
        // Get latest addresses
        const latestUser = await User.findById(userId);

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            allAddress: latestUser.address
        });

    } catch (error) {
        console.error("Error deleting address:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
// 6. SET DEFAULT ADDRESS (Bonus - if needed)
const setDefaultAddress = async (req, res) => {
    try {
        // Step 1: Get address ID from params and user ID from middleware
        const { addressId } = req.params;
        const userId = req.result._id;

        // Step 2: Check if address exists
        const user = await User.findById(userId);

        const addressExists = user.address.some(
            addr => addr._id.toString() === addressId
        );

        if (!addressExists) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const result = user.address.forEach((addr) => {
            if (addr._id.toString() === addressId) {
                addr.isDefault = true;
            }
            else {
                addr.isDefault = false;
            }
        })
        await user.save();

        const userfinal = User.findById(userId);

        return res.status(200).json({
            success: true,
            message: "Maked address default successfully",
            addressId

        })
    } catch (error) {
        console.error('Error setting default address:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
module.exports = {
    register,
    login,
    logout,
    checkAuth,
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};