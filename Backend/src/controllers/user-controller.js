const User = require('../models/user');
const validate = require('../utils/validate');
const redisClient = require('../config/redis');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        console.log("Register endpoint hit");

        validate(req.body); // function call for the validation 

        const { firstName, emailId, password } = req.body; // destructuring of the object

        const saltRounds = 5;

        req.body.password = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create(req.body);

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
                lastName: user.lastName
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
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "No token provided"
            });
        }

        // Check if token is blacklisted
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Token has been invalidated"
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    isAuthenticated: false,
                    message: "Token has expired"
                });
            }
            return res.status(401).json({
                isAuthenticated: false,
                message: "Invalid token"
            });
        }

        // Check if user still exists in database
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "User no longer exists"
            });
        }

        // Return user info
        res.status(200).json({
            isAuthenticated: true,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            isAuthenticated: false,
            message: "Authentication check failed",
            error: err.message || "Something went wrong"
        });
    }
}

module.exports = { register, login, logout, checkAuth };