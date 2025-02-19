const axios = require('axios');
const { pool } = require('../config/database');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

const initializePayment = async ({ email, amount, currency = 'NGN', callback_url }) => {
  try {
    // Convert amount to kobo (Paystack expects amount in kobo)
    const amountInKobo = Math.round(amount * 100);

    const response = await paystackAPI.post('/transaction/initialize', {
      email,
      amount: amountInKobo,
      currency,
      callback_url
    });

    if (response.data.status) {
      // Save transaction to database
      await pool.execute(
        'INSERT INTO transactions (reference, amount, currency, payment_type, status, customer_email) VALUES (?, ?, ?, ?, ?, ?)',
        [response.data.data.reference, amount, currency, 'paystack', 'pending', email]
      );

      return response.data;
    }
    throw new Error('Failed to initialize payment');
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
};

const verifyPayment = async (reference) => {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);

    if (response.data.status) {
      const { status, amount, currency } = response.data.data;
      
      // Update transaction status in database
      await pool.execute(
        'UPDATE transactions SET status = ? WHERE reference = ?',
        [status, reference]
      );

      return {
        status: true,
        data: {
          status,
          amount: amount / 100, // Convert back from kobo
          currency,
          reference
        }
      };
    }
    throw new Error('Payment verification failed');
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

module.exports = {
  initializePayment,
  verifyPayment
}; 