require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors=require('cors')

const axios=require('axios');

const main=require('./src/config/db');
const redisClient = require('./src/config/redis');


const userRouter=require('./src/routes/user-routes');
const cartRouter=require('./src/routes/cart-routes')
const orderRouter=require('./src/routes/order-routes')
const paymentRouter=require('./src/routes/payment-routes')

const app = express();

const corsOptions = {
    origin:  'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/test', (req, res) => {
  res.send("Server is working!");
});

app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.use('/api/payment',paymentRouter)

const initailizeConnection=async ()=>{
    try{
        
        await  Promise.all([main(),await redisClient.connect() ]);
        console.log("DB Connected");

         app.listen(process.env.PORT, () => {
         console.log(`Server is running at port no. ${process.env.PORT}`);

         });
    }
    catch(err){
        console.log("Error "+err);
    }
}
initailizeConnection();
