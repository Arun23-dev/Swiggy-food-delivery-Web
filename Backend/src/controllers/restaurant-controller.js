const axios = require('axios');

async function getAllRestaurants(res, res) {

    const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true`;
    try {
        const response = await axios.get(swiggyUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }

        })

        res.json(response.data);

    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to Restaurants' });

    }

}

async function getRestaurantMenu(req, res) {
    const { restaurantId } = req.params;

    const swiggyUrl = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;

    try {
        const response = await axios.get(swiggyUrl,
            {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }

        })

    
        res.json(response.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
}


module.exports = {
    getAllRestaurants, getRestaurantMenu

}
