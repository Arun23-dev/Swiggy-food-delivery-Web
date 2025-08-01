const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();


app.use(cors());

app.get("/api", async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith("https://www.swiggy.com")) {
    return res.status(400).json({ error: "Invalid or missing Swiggy URL" });
  }

  try {
    const response = await axios.get(decodeURIComponent(url), {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
