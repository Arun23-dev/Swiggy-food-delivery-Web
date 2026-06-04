const redisClient = require('../config/redis');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) throw new Error("token absent");

        const payload = jwt.verify(token, process.env.JWT_KEY);
        if (!payload._id) throw new Error("Invalid token");

        const result = await User.findById(payload._id);
        if (!result) throw new Error("User doesn't exist");

        // ✅ Redis isolated — its failure won't cause 401
        try {
            const isBlocked = await redisClient.exists(`token:${token}`);
            if (isBlocked) throw new Error("Invalid token");
        } catch (redisErr) {
            if (redisErr.message === "Invalid token") throw redisErr;
            console.error("Redis failed:", redisErr.message); // check Render logs
        }

        req.result = result;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            isAuthenticated: false,
            message: err.message || "Authentication failed"
        });
    }
}

module.exports = userMiddleware;