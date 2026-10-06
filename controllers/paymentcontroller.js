const {logger}=require("../utils/logger")
const mtnMomo = require("dadson-momo-stk");
const _Momo = new mtnMomo({
  basicAuth: process.env.SANDBOX_BASIC_AUTH,
  collectionKey: process.env.SANDBOX_OCP_COLLECTION_KEY,
  baseUrl: "https://sandbox.momodeveloper.mtn.com", // Sandbox baseUrl
  targetEnvironment: "sandbox", // Sandbox environment
});


const MakePayment = async (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-controller",req.body.access_token);
  const form = {
    amount: req.body.amount,
    currency: req.body.currency,
    externalId: req.body.XReferenceId,
    payer: {
      partyIdType: req.body.payer.partyIdType,
      partyId: req.body.payer.partyId,
    },
    payerMessage:req.body.payerMessage,
    payeeNote: req.body.payeeNote,
    accessToken: req.body.access_token,
  };

  try {
    const paymentResponse = await _Momo.initializePayment(form);
    logger("paymentResponse",paymentResponse);
    return res.status(200).json(paymentResponse);
  } catch (error) {
    logger("dadson-momo-stk-internal-api-request-to-pay-controller-error",error);
    return res.status(500).json({ error: error.response.data?.message || "Payment request failed" });
  }
};

const VerifyPayment = async (req, res) => {
  logger("dadson-momo-stk-internal-api-request-to-pay-verify-payment-controller","......");

  const form = {
    externalId: req.body.externalId,
    accessToken: req.body.access_token,
  };

  try {
    const verifyResponse = await _Momo.verifyPayment(form);
    logger("verifyResponse",verifyResponse);
    return res.status(200).json(verifyResponse);
  }catch (error) {
    logger("dadson-momo-stk-internal-api-request-to-pay-verify-payment-controller-error",error);
    return res.status(500).json({ error: error.response.data?.message || "Payment verification failed" });
  }      
};


module.exports = { MakePayment, VerifyPayment };
