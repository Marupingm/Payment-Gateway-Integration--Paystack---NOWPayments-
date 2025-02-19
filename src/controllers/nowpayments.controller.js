const axios = require('axios');
const { pool } = require('../config/database');

const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';

const nowpaymentsAPI = axios.create({
  baseURL: NOWPAYMENTS_BASE_URL,
  headers: {
    'x-api-key': process.env.NOWPAYMENTS_API_KEY,
    'Content-Type': 'application/json'
  }
});

const createInvoice = async ({
  price_amount,
  price_currency,
  pay_currency,
  order_id,
  order_description
}) => {
  try {
    const response = await nowpaymentsAPI.post('/invoice', {
      price_amount,
      price_currency,
      pay_currency,
      order_id,
      order_description,
      ipn_callback_url: process.env.NOWPAYMENTS_IPN_URL,
      success_url: process.env.NOWPAYMENTS_SUCCESS_URL,
      cancel_url: process.env.NOWPAYMENTS_CANCEL_URL
    });

    if (response.data) {
      // Save transaction to database
      await pool.execute(
        'INSERT INTO transactions (reference, amount, currency, payment_type, status, customer_email) VALUES (?, ?, ?, ?, ?, ?)',
        [response.data.id, price_amount, price_currency, 'nowpayments', 'pending', null]
      );

      return {
        status: true,
        data: response.data
      };
    }
    throw new Error('Failed to create invoice');
  } catch (error) {
    console.error('NOWPayments invoice creation error:', error);
    throw new Error(error.response?.data?.message || 'Invoice creation failed');
  }
};

const verifyTransaction = async (payment_id) => {
  try {
    const response = await nowpaymentsAPI.get(`/payment/${payment_id}`);

    if (response.data) {
      const { payment_status, pay_amount, pay_currency } = response.data;

      // Update transaction status in database
      await pool.execute(
        'UPDATE transactions SET status = ? WHERE reference = ?',
        [payment_status, payment_id]
      );

      return {
        status: true,
        data: {
          status: payment_status,
          amount: pay_amount,
          currency: pay_currency,
          payment_id
        }
      };
    }
    throw new Error('Payment verification failed');
  } catch (error) {
    console.error('NOWPayments verification error:', error);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
};

module.exports = {
  createInvoice,
  verifyTransaction
}; 