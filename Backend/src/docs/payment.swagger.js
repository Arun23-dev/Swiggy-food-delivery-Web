
/**
 * @swagger
 * /api/payment/esewa/initiate:
 *   post:
 *     tags: [Payment]
 *     summary: Initiate eSewa payment
 *     description: >
 *       Returns signed payload to submit directly to eSewa's
 *       payment form. No auth required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, transactionId]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 236
 *               tax_amount:
 *                 type: number
 *                 example: 0
 *                 description: Defaults to 0 if not provided
 *               transactionId:
 *                 type: string
 *                 example: "ae1585af-b4b0-44f2-9a28-88486cdb9055"
 *     responses:
 *       200:
 *         description: eSewa form payload with signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                   example: 236
 *                 tax_amount:
 *                   type: number
 *                   example: 0
 *                 total_amount:
 *                   type: number
 *                   example: 236
 *                 transaction_uuid:
 *                   type: string
 *                   example: "ae1585af-b4b0-44f2-9a28-88486cdb9055"
 *                 product_code:
 *                   type: string
 *                   example: "EPAYTEST"
 *                 product_service_charge:
 *                   type: string
 *                   example: "0"
 *                 product_delivery_charge:
 *                   type: string
 *                   example: "0"
 *                 success_url:
 *                   type: string
 *                   example: "https://yourapp.com/checkout/payment/esewa/success"
 *                 failure_url:
 *                   type: string
 *                   example: "https://yourapp.com/checkout/payment/esewa/failure"
 *                 signed_field_names:
 *                   type: string
 *                   example: "total_amount,transaction_uuid,product_code"
 *                 signature:
 *                   type: string
 *                   example: "4XF9..."
 */

/**
 * @swagger
 * /api/payment/esewa/verify:
 *   get:
 *     tags: [Payment]
 *     summary: Verify eSewa payment (callback)
 *     description: >
 *       Called by eSewa redirect after payment. Verifies status
 *       with eSewa API and marks payment as paid in DB.
 *     parameters:
 *       - in: query
 *         name: transaction_uuid
 *         required: true
 *         schema:
 *           type: string
 *         example: "ae1585af-b4b0-44f2-9a28-88486cdb9055"
 *       - in: query
 *         name: total_amount
 *         required: true
 *         schema:
 *           type: number
 *         example: 236.0
 *     responses:
 *       200:
 *         description: Payment complete or failed
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Payment complete
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "COMPLETE"
 *                     transaction_code:
 *                       type: string
 *                     total_amount:
 *                       type: string
 *                 - type: object
 *                   description: Payment failed
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "FAILED"
 *                     message:
 *                       type: string
 *                       example: "Payment not completed"
 *       500:
 *         description: Verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Verification failed"
 */
/**
 * @swagger
 * /api/payment:
 *   get:
 *     tags: [Payment]
 *     summary: Get current user's payment history & summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "payment details successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     pending:
 *                       type: object
 *                       properties:
 *                         pendingPay: { type: number }
 *                         noOftransactioniInPendingPay: { type: number }
 *                     paid:
 *                       type: object
 *                       properties:
 *                         totalPaid: { type: number }
 *                         noofTranscationInTotalPaid: { type: number }
 *                     failed:
 *                       type: object
 *                       properties:
 *                         failedAmount: { type: number }
 *                         noOfFailed: { type: number }
 *                     refund:
 *                       type: object
 *                       properties:
 *                         refundedAmout: { type: number }
 *                         noOfRefund: { type: number }
 *       500:
 *         description: Failure in fetching the data
 */


module.exports = {};

