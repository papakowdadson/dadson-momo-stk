const express = require('express');
const paymentRoute = express.Router();

const { MakePayment,VerifyPayment} = require('../controllers/paymentcontroller');
const {CreateAccessToken} = require('../middleware/accessTokenGenerator');

paymentRoute.post('/makePayment',CreateAccessToken,MakePayment);

// paymentRoute.get('/checkPaymentStatus',CreateAccessToken,CheckPaymentStatus);

paymentRoute.post('/verifyPayment',CreateAccessToken,VerifyPayment);



module.exports = paymentRoute;