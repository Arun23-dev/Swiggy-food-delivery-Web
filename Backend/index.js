require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors=require('cors')

const main=require('./src/config/db');
const authRouter=require('./src/routes/userAuth');
const cartRouter=require('./src/routes/cart-routes')
const redisClient = require('./src/config/redis');


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/test', (req, res) => {
  res.send("Server is working!");
});

app.use('/api/user',authRouter);
app.use('/api/cart',cartRouter)

const initailizeConnection=async ()=>{
    try{
        await  Promise.all([main(), await redisClient.connect()]);
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
