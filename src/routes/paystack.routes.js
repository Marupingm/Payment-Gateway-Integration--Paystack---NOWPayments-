const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { initializePayment, verifyPayment } = require('../controllers/paystack.controller');

// Validation middleware
const validateInitializePayment = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['NGN','ZAR', 'USD', 'GHS']).withMessage('Invalid currency')
];

// Initialize payment route
router.post('/initialize',
  validateInitializePayment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const result = await initializePayment(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

// Verify payment route
router.post('/verify',
  body('reference').notEmpty().withMessage('Reference is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await verifyPayment(req.body.reference);
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