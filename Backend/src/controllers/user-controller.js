const User = require('../models/user');
const validate = require('../utils/validate');
const redisClient = require('../config/redis');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {

        // validate(req.body); // function call for the validation 

        const firstName = req.body.name.trim().split(" ")[0];
        const emailId = req.body.email;
        const password = req.body.password;
        // 4
        // need ot make the better optimization 


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
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

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
            error: err.message || "Unknown error occurred"
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
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                emailId: user.emailId,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                address:user.address,
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

        res.cookie("token", null, { expires: new Date(Date.now()) });

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
        const userId = req.result._id;
        // console.log(req.result);
        // console.log(userId);
        // Validation
        if (!label || !street || !city || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode'
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Create new address (MongoDB will auto-add _id)
        const newAddress = {
            label,
            street,
            city,
            pincode,
            isDefault: user.address.length === 0
        };
        
        user.address.push(newAddress);
        await user.save();
        
        // Get the added address with its auto-generated _id
        const addedAddress = user.address[user.address.length - 1];
        
        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: addedAddress  // This includes the _id
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
        const userId = req.user.id;

        // Step 2: Find all addresses for this user
        const addresses = await Usser.find({ userId: userId }).sort({ isDefault: -1, createdAt: -1 });

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

// 3. UPDATE ADDRESS
const updateAddress = async (req, res) => {
    try {
        // Step 1: Get address ID from params and user ID from middleware
        const { addressId } = req.params;
        const userId = req.user.id;
        const { label, street, city, pincode } = req.body;

        // Step 2: Find the address
        const address = await Address.findOne({ _id: addressId, userId: userId });

        // Step 3: Check if address exists
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Step 4: Validate pincode if provided
        if (pincode && !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pincode. Must be 6 digits'
            });
        }

        // Step 5: Update fields (only if provided)
        if (label) address.label = label;
        if (street) address.street = street;
        if (city) address.city = city;
        if (pincode) address.pincode = pincode;

        // Step 6: Save the updated address
        await address.save();

        // Step 7: Send success response
        return res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: address
        });

    } catch (error) {
        console.error('Error updating address:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// 4. DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        // Step 1: Get address ID from params and user ID from middleware
        const { addressId } = req.params;
        const userId = req.user.id;

        // Step 2: Find and delete the address
        const address = await Address.findOneAndDelete({ _id: addressId, userId: userId });

        // Step 3: Check if address exists
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Step 4: If deleted address was default, make another address default
        if (address.isDefault) {
            const nextAddress = await Address.findOne({ userId: userId });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        // Step 5: Send success response
        return res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: {
                deletedAddress: address,
                id: addressId
            }
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};


// 6. SET DEFAULT ADDRESS (Bonus - if needed)
const setDefaultAddress = async (req, res) => {
    try {
        // Step 1: Get address ID from params and user ID from middleware
        const { addressId } = req.params;
        const userId = req.user.id;

        // Step 2: Check if address exists
        const address = await Address.findOne({ _id: addressId, userId: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        // Step 3: Remove default from all addresses
        await Address.updateMany({ userId: userId }, { isDefault: false });

        // Step 4: Set new default address
        address.isDefault = true;
        await address.save();

        // Step 5: Send success response
        return res.status(200).json({
            success: true,
            message: 'Default address updated successfully',
            data: address
        });

    } catch (error) {
        console.error('Error setting default address:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// ==================== EXPORT ALL CONTROLLERS ====================
module.exports = {
    // Bonus
}; module.exports = {
    register,
    login,
    logout,
    checkAuth
    , addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,      // Bonus
    setDefaultAddress
};