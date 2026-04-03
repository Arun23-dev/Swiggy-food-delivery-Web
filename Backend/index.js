require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const main=require('./src/config/db');
const authRouter=require('./src/routes/userAuth');
const redisClient = require('./src/config/redis');
const cors=require('cors')


const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
  res.send("Server is working!");
});

app.use('/user',authRouter);

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
