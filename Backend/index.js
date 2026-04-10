require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors=require('cors')

const main=require('./src/config/db');
const redisClient = require('./src/config/redis');


const userRouter=require('./src/routes/user-routes');
const cartRouter=require('./src/routes/cart-routes')

const app = express();

const corsOptions = {
    origin:  'http://localhost:5173', // Your frontend URL
    credentials: true, // Important: Allow cookies to be sent
    optionsSuccessStatus: 200,
    // allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/test', (req, res) => {
  res.send("Server is working!");
});

app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter)

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
