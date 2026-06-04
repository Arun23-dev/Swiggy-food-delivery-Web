/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     tags: [Restaurant]
 *     summary: Get all restaurants
 *     description: Fetches live restaurant list from Swiggy API
 *     responses:
 *       200:
 *         description: Restaurants fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       500:
 *         description: Failed to fetch restaurants
 */

/**
 * @swagger
 * /api/restaurants/{restaurantId}:
 *   get:
 *     tags: [Restaurant]
 *     summary: Get restaurant menu
 *     description: Fetches live menu from Swiggy API for a given restaurant
 *     parameters:
 *       - name: restaurantId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "55473"
 *     responses:
 *       200:
 *         description: Menu fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       500:
 *         description: Failed to fetch menu
 */

module.exports = {};