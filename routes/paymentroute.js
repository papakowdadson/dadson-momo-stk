const express = require('express');
const paymentRoute = express.Router();

const { MakePayment,VerifyPayment,CheckPaymentStatus} = require('../controllers/paymentcontroller');
const {CreateAccessToken} = require('../middleware/payment');

paymentRoute.post('/makePayment',CreateAccessToken,MakePayment);

paymentRoute.get('/checkPaymentStatus',CreateAccessToken,CheckPaymentStatus);

paymentRoute.post('/verifyPayment',CreateAccessToken,VerifyPayment);



module.exports = paymentRoute;