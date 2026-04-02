require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const main=require('./src/config/db');
const authRouter=require('./src/routes/userAuth');
const problemRouter=require('./src/routes/problemCreator')
const submitRouter=require('./src/routes/codeSubmit');
const redisClient = require('./src/config/redis');


const app = express();
app.use(express.json());
app.use(cookieParser()); 

app.get('/test', (req, res) => {
  res.send("Server is working!");
});

app.use('/user',authRouter);
const corsOptions = {
  origin: process.env.ORIGIN_URL || 'http://localhost:8000',
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.get('/resturants', async (req, res) => {
  const offset = req.query.offset || 0;

  try {
    const swiggyURL = `${process.env.FOOD_DELIVERY}${offset}`;
    const response = await axios.get(swiggyURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants', details: err.message });
  }
});


app.get('/city/delhi/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const url = `${process.env.FOOD_MENU_PREFIX}${id}${process.env.FOOD_MENU_SUFFIX}`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu', details: err.message });
  }
});

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
