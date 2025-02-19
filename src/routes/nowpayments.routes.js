const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createInvoice, verifyTransaction } = require('../controllers/nowpayments.controller');

// Validation middleware
const validateCreateInvoice = [
  body('price_amount').isNumeric().withMessage('Price amount must be a number'),
  body('price_currency').isString().withMessage('Price currency is required'),
  body('pay_currency').isString().withMessage('Payment currency is required'),
  body('order_id').optional().isString(),
  body('order_description').optional().isString()
];

// Create invoice route
router.post('/create-invoice',
  validateCreateInvoice,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await createInvoice(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

// Verify transaction route
router.post('/verify',
  body('payment_id').notEmpty().withMessage('Payment ID is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await verifyTransaction(req.body.payment_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

module.exports = router; 