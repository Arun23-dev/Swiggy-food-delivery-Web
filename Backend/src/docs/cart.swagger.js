/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get user cart
 *     security:
 *       - bearerAuth: []
 *    
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/cart/item/{itemId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Update item quantity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 2
 *               restaurantId:
 *                 type: string
 *                 example: r123
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Quantity updated
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */
/**
/**
 * @swagger
 * /api/cart/selectedItems:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove selected items from cart (single or bulk)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - restaurantId
 *                     - itemIds
 *                   properties:
 *                     restaurantId:
 *                       type: string
 *                       example: "55473"
 *                     itemIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["107436715", "107436674", "107436836"]
 *           examples:
 *             single:
 *               summary: Remove single item
 *               value:
 *                 items:
 *                   - restaurantId: "55473"
 *                     itemIds: ["107436715"]
 *             bulk:
 *               summary: Remove multiple items across restaurants
 *               value:
 *                 items:
 *                   - restaurantId: "55473"
 *                     itemIds: ["107436715", "107436674", "107436836"]
 *                   - restaurantId: "603438"
 *                     itemIds: ["168735724", "194024695"]
 *     responses:
 *       200:
 *         description: Items removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Item removed
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Cart not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     tags: [Cart]
 *     summary: Clear entire cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cart cleared
 *                 cart:
 *                   type: object
 *                   properties:
 *                     restaurants:
 *                       type: array
 *                       example: []
 *                     count:
 *                       type: number
 *                       example: 0
 *                     totalAmount:
 *                       type: number
 *                       example: 0
 */
/** 
 * @swagger
 * /api/cart/sync:
 *   post:
 *     tags: [Cart]
 *     summary: Sync local cart with server
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               syncType:
 *                 type: string
 *                 example: merge
 *               localCart:
 *                 $ref: '#/components/schemas/Cart'
 *           example:
 *             syncType: "merge"
 *             localCart:
 *               restaurants:
 *                 - restaurantId: "55473"
 *                   restaurantName: "Pizza Hut"
 *                   city: "Delhi"
 *                   locality: "Rohini"
 *                   items:
 *                     - swiggyItemId: "107436923"
 *                       name: "Veggie Feast"
 *                       price: 26900
 *                       quantity: 1
 *                       image: "FOOD_CATALOG/IMAGES/CMS/2026/1/5/185b654c.jpg"
 *               count: 1
 *               
 *     responses:
 *       200:
 *         description: Cart synced
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 */

module.exports={};
