const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

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

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
