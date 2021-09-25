require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paystackRoutes = require('./routes/paystack.routes');
const nowpaymentsRoutes = require('./routes/nowpayments.routes');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/paystack', paystackRoutes);
app.use('/api/nowpayments', nowpaymentsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
}); // Modified on 2025-02-20 13:47:35
