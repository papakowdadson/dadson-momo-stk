const {logger}=require("../utils/logger")
const mtnMomo = require("dadson-momo-stk");
const _Momo = new mtnMomo({
  basicAuth: process.env.MTN_BASIC_AUTH,
  collectionKey: process.env.MTN_OCP_COLLECTION_KEY,
});


const MakePayment = async (req, res) => {
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

  const paymentResponse = await _Momo.initializePayment(form);
  logger("paymentResponse",paymentResponse);
  if (!paymentResponse) {
      res.status(500).json({ error: error });
  } else {
      res.status(200).json(body);
  }
};

const VerifyPayment = async (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-verify-payment-controller","......");

  const form = {
    ref: req.body.externalId,
    access_token: req.body.access_token,
  };
  const verifyResponse = await _Momo.verifyPayment(form);
  logger("verifyResponse",verifyResponse);
  if (!verifyResponse) {
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
};


module.exports = { MakePayment, VerifyPayment };
