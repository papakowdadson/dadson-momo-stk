# dadson-momo-stk

A simple Mobile money toolkit with reusable middleware and utilities for Express applications.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Middleware](#middleware)
  - [createAccessToken](#createAccessToken)
  - [initializePayment](#initializePayment)
  - [verifyPayment](#verifyPayment)
- [Utilities](#utilities)
- [Routes](#routes)
- [License](#license)

## Installation

To install this toolkit, you can use npm:

```sh
npm install @papakowdadson/dadson-momo-stk

USAGE
Here’s an example of how to use the toolkit in an Express application-MVC:

- Create a .env file with the PORT value
//Sample .env
`
PORT=5000
MTN_BASE_URL_SANDBOX=https://sandbox.momodeveloper.mtn.com // Textbed URL
MTN_BASIC_AUTH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MTN_BASE_URL=https://proxy.momoapi.mtn.com // Production url
MTN_OCP_COLLECTION_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
`

- Create index.js file
`
//Sample index.js
const express = require("express");
const cors = require("cors");
const app = express();
const { urlencoded } = require("express");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

const paymentRoute = require("./routes/paymentroute");

app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/@your url/payment", paymentRoute);//sample route, change to any route of your choice

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
`

- Create Route file
- Create Controller file



Middleware
createAccessToken
Generates access token for each request from `MTN_BASIC_AUTH`. Call this method to generate access token before making any request.It accepts a callback function.

Usage
Example
`
const mtnMomo = require('papakowdadson/dadson-momo-stk');
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH,process.env.MTN_OCP_COLLECTION_KEY);
const { createAccessToken } = _Momo;

const GenerateAccessToken = (req, res, next) => {
  console.log("====creating access token====");
  createAccessToken((error, body) => {
    if (body) {
      const _body = JSON.parse(body);
      if (_body.access_token) {
        req.body.access_token = _body.access_token;
        next();
      } else {
        res.status(400).json({ error: "No token in body" });
      }
    } else {
      res.status(500).json({ error: "couldn't create access token" });
    }
  });
};
module.exports = { GenerateAccessToken };
`


Middleware
initializePayment
Initiates a request to pay to clients MSISDN.It accepts a form and a callback

Usage
`
const mtnMomo = = require('papakowdadson/dadson-momo-stk');
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH,process.env.MTN_OCP_COLLECTION_KEY);
const {initializePayment}=_Momo;
`

Example
`
const MakePayment = (req, res) => {
  const form = {
    amount: req.body.amount,
    currency: "GHS",
    externalId: req.body.XReferenceId,
    payer: {
      partyIdType: "MSISDN",
      partyId: req.body.payer.partyId,
    },
    payerMessage:req.body.payerMessage,
    payeeNote: req.body.payeeNote,
    access_token: req.body.access_token,
  }; 

  initializePayment(form, (error, body) => {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(200).json(body);
    }
  });
};
`


Middleware
verifyPayment
Checks the status of transaction. It accepts form an a callback

Usage
`
const mtnMomo = = require('papakowdadson/dadson-momo-stk');
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH,process.env.MTN_OCP_COLLECTION_KEY);
const {verifyPayment}=_Momo;
`

Example
`
const VerifyPayment = (req, res) => {
  const form = {
    ref: req.body.externalId,
    access_token: req.body.access_token,
  };
  verifyPayment(form, (error, body) => {
    if (error) {
    //handle errors appropriately
       res.status(500).json(error);
    } else {
      const _body = JSON.parse(body);
      if (_body.status == "SUCCESSFUL") {
        const data = {
          amount: _body.amount,
          MSISDN: _body.payer.partyId,
          message: _body.payeeNote,
          paymentRef: _body.externalId,
          paymentStatus: _body.status,
        };
        res.status(200).json(data);
      } else {
        // Req to Pay failed
        res.status(400).json(_body);
      }
      // response = JSON.parse(body);
    }
  });
};
`





Utilities
// No utilities used yet

Routes
Predefined routes, to be documented here.

Example Route

Usage



License
This project is licensed under the MIT License - see the LICENSE file for details.

Contributing
If you would like to contribute to this project, please fork the repository and submit a pull request. We appreciate your contributions!

Issues
If you encounter any issues or have suggestions for improvements, please open an issue in the  <a href='https://github.com/papakowdadson/dadson-momo-stk/issues'>GitHub Repository</a>.






