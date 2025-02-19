# Payment Gateway Integration API

This project implements a payment gateway integration API using Node.js, Express, Paystack, and NOWPayments. It provides endpoints for processing both traditional (Paystack) and cryptocurrency (NOWPayments) payments.

## Features

- Paystack Integration
  - Initialize payment
  - Verify payment status
- NOWPayments Integration
  - Create crypto payment invoice
  - Verify crypto transaction status
- MySQL Database for transaction history
- Input validation and error handling
- Secure API key management

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Paystack Account and API Keys
- NOWPayments Account and API Key

## Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd payment-gateway-integration
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the .env file with your configuration:
- Add your Paystack API keys
- Add your NOWPayments API key
- Configure your database credentials
- Set your environment-specific variables

5. Create the MySQL database:
\`\`\`sql
CREATE DATABASE payment_gateway_db;
\`\`\`

6. Start the server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Paystack

1. Initialize Payment
\`\`\`http
POST /api/paystack/initialize
Content-Type: application/json

{
  "email": "customer@example.com",
  "amount": 1000,
  "currency": "NGN"
}
\`\`\`

2. Verify Payment
\`\`\`http
POST /api/paystack/verify
Content-Type: application/json

{
  "reference": "payment_reference"
}
\`\`\`

### NOWPayments

1. Create Invoice
\`\`\`http
POST /api/nowpayments/create-invoice
Content-Type: application/json

{
  "price_amount": 100,
  "price_currency": "USD",
  "pay_currency": "BTC",
  "order_id": "order_123",
  "order_description": "Payment for Order #123"
}
\`\`\`

2. Verify Transaction
\`\`\`http
POST /api/nowpayments/verify
Content-Type: application/json

{
  "payment_id": "payment_id"
}
\`\`\`

## Security

- API keys are stored in environment variables
- Input validation is implemented for all endpoints
- CORS and Helmet middleware for security headers
- Database credentials are protected
- Error messages are sanitized in production

## Error Handling

The API implements proper error handling with appropriate HTTP status codes and error messages. All endpoints return consistent error response formats:

\`\`\`json
{
  "status": false,
  "message": "Error message"
}
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 