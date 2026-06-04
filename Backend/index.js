require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./src/config/swagger/swagger.config");
const main = require('./src/config/db');
const redisClient = require('./src/config/redis');

const userRouter = require('./src/routes/user-routes');
const cartRouter = require('./src/routes/cart-routes');
const orderRouter = require('./src/routes/order-routes');
const paymentRouter = require('./src/routes/payment-routes');
const restaurantRouter = require('./src/routes/restaurant-routes');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://swiggy-food-delivery-web-dyl3.vercel.app',
        'https://www.swiggytech.me'
    ],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /test:
 *   get:
 *     tags: [Health]
 *     summary: Check server status
 *     description: Returns a simple message to confirm the server is working
 *     responses:
 *       200:
 *         description: Server is working successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Server is working!
 */
app.get('/test', (req, res) => {
    res.send("Server is working!");
});

// routes
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/restaurants', restaurantRouter);

// server init
const initializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (err) {
        console.log("Error " + err);
    }
};

initializeConnection();