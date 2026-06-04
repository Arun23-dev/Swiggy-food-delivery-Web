/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arun Chaudhary
 *
 *               email:
 *                 type: string
 *                 example: arunch23@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: Arun@123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailId
 *               - password
 *             properties:
 *               emailId:
 *                 type: string
 *                 example: arunch23@gmail.com
 *               password:
 *                 type: string
 *                 example: Arun@123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: jwt-token
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags: [User]
 *     summary: Get logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/profile:
 *   patch:
 *     tags: [User]
 *     summary: Update user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Arun
 *               lastName:
 *                 type: string
 *                 example: Chaudhary
 *               age:
 *                 type: number
 *                 example: 23
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: Profile updated
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/profile/image:
 *   patch:
 *     tags: [User]
 *     summary: Upload user profile image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/address:
 *   post:
 *     tags: [User]
 *     summary: Add user address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - street
 *               - city
 *               - pincode
 *             properties:
 *               label:
 *                 type: string
 *                 example: Home
 *               street:
 *                 type: string
 *                 example: Street 12
 *               city:
 *                 type: string
 *                 example: Kathmandu
 *               pincode:
 *                 type: string
 *                 example: 446600
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/address/{addressId}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                   example: Address removed
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags: [User]
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Logout successful
 */


// 1. POST /api/user/address  —  addAddress
/**
 * @swagger
 * /api/user/address:
 *   post:
 *     tags: [Address]
 *     summary: Add a new address
 *     description: |
 *       Adds a new address for the logged-in user.
 *       - All 4 fields are **required**.
 *       - Pincode must be exactly **6 numeric digits**.
 *       - Max **3 addresses** allowed per user.
 *       - If `isDefault: true`, all existing addresses are reset to non-default first.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *           examples:
 *             default_home:
 *               summary: Add a default home address
 *               value:
 *                 label: "Home"
 *                 street: "45 MG Road, Near City Mall"
 *                 city: "Mumbai"
 *                 pincode: "400001"
 *                 isDefault: true
 *             office:
 *               summary: Add a non-default office address
 *               value:
 *                 label: "Office"
 *                 street: "12 BKC, Bandra Kurla Complex"
 *                 city: "Mumbai"
 *                 pincode: "400051"
 *                 isDefault: false
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         allAddress:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Address'
 *             example:
 *               success: true
 *               message: "Address added successfully"
 *               data:
 *                 allAddress:
 *                   - _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     label: "Home"
 *                     street: "45 MG Road, Near City Mall"
 *                     city: "Mumbai"
 *                     pincode: "400001"
 *                     isDefault: true
 *       400:
 *         description: Missing fields or invalid pincode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 value:
 *                   success: false
 *                   message: "All fields are required"
 *               invalid_pincode:
 *                 value:
 *                   success: false
 *                   message: "Invalid pincode || pincode must be of 6 digit"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "User not found"
 *       500:
 *         description: Internal server error (e.g. max 3 address limit hit)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "A user can have at most 3 address"
 */



// 2. GET /api/user/address  —  getAddresses
/**
 * @swagger
 * /api/user/address:
 *   get:
 *     tags: [Address]
 *     summary: Get all addresses
 *     description: Returns all saved addresses for the authenticated user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Addresses returned (empty array if none exist)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *             examples:
 *               with_addresses:
 *                 summary: User has saved addresses
 *                 value:
 *                   success: true
 *                   message: "Addresses fetched successfully"
 *                   count: 2
 *                   data:
 *                     - _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                       label: "Home"
 *                       street: "45 MG Road"
 *                       city: "Mumbai"
 *                       pincode: "400001"
 *                       isDefault: true
 *                     - _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                       label: "Office"
 *                       street: "12 BKC"
 *                       city: "Mumbai"
 *                       pincode: "400051"
 *                       isDefault: false
 *               no_addresses:
 *                 summary: User has no addresses yet
 *                 value:
 *                   success: true
 *                   message: "No addresses found"
 *                   count: 0
 *                   data: []
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


// 3. PUT /api/user/address/:addressId  —  updateAddress
/**
 * @swagger
 * /api/user/address/{addressId}:
 *   put:
 *     tags: [Address]
 *     summary: Update an address
 *     description: |
 *       Updates all fields of an existing address by its ID.
 *       Pincode is validated only when provided.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: MongoDB `_id` of the address to update
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *           example:
 *             label: "Home Updated"
 *             street: "100 New Street"
 *             city: "Delhi"
 *             pincode: "110001"
 *             isDefault: true
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *             example:
 *               success: true
 *               message: "Address updated successfully"
 *               data:
 *                 - _id: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                   label: "Home Updated"
 *                   street: "100 New Street"
 *                   city: "Delhi"
 *                   pincode: "110001"
 *                   isDefault: true
 *       400:
 *         description: Invalid pincode format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid pincode. Must be 6 digits"
 *       404:
 *         description: Address not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Address not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


// 4. DELETE /api/user/address/:addressId  —  deleteAddress
/**
 * @swagger
 * /api/user/address/{addressId}:
 *   delete:
 *     tags: [Address]
 *     summary: Delete an address
 *     description: |
 *       Deletes an address by ID.
 *       If the deleted address was the **default**, the first remaining
 *       address is automatically promoted to default.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: MongoDB `_id` of the address to delete
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Address deleted — returns updated address array
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     allAddress:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *             example:
 *               success: true
 *               message: "Address deleted successfully"
 *               allAddress:
 *                 - _id: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                   label: "Office"
 *                   street: "12 BKC"
 *                   city: "Mumbai"
 *                   pincode: "400051"
 *                   isDefault: true
 *       404:
 *         description: User or address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 value:
 *                   success: false
 *                   message: "User not found"
 *               address_not_found:
 *                 value:
 *                   success: false
 *                   message: "Address not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */



// 5. PATCH /api/user/address/:addressId/default  —  setDefaultAddress
/**
 * @swagger
 * /api/user/address/{addressId}/default:
 *   patch:
 *     tags: [Address]
 *     summary: Set an address as default
 *     description: |
 *       Marks the given address as the user's default delivery address.
 *       All other addresses are automatically set to `isDefault: false`.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: MongoDB `_id` of the address to make default
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     responses:
 *       200:
 *         description: Default address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     addressId:
 *                       type: string
 *                       description: ID of the address that was made default
 *             example:
 *               success: true
 *               message: "Maked address default successfully"
 *               addressId: "64f1a2b3c4d5e6f7a8b9c0d2"
 *       404:
 *         description: Address not found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Address not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 *               error: "Cast to ObjectId failed..."
 */

module.exports = {};

