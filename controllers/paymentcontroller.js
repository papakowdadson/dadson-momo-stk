const {logger}=require("../utils/logger")
const mtnMomo = require("../middleware/mtnMomo");
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH,process.env.MTN_OCP_COLLECTION_KEY);
const {initializePayment, verifyPayment}=_Momo;


const MakePayment = (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-controller","......");
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

const VerifyPayment = (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-verify-payment-controller","......");

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
        res.status(400).json(_body);
      }
    }
  });
};

const CheckPaymentStatus = (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-check-payment-status-controller","Yet to be implemented.........");
};

module.exports = { MakePayment, VerifyPayment, CheckPaymentStatus };
