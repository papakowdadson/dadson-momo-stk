const mtnMomo = require("../middleware/mtnMomo");
const _Momo = mtnMomo(process.env.MTN_BASIC_AUTH);
const {initializePayment, verifyPayment}=_Momo;


const MakePayment = (req, res) => {
  console.log("======Payment controller=====");
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
      //handle errors
      // console.log("===Request to Pay controller error==",error.response)
      res.status(500).json({ error: error });
      // throw error;
    } else {
      console.log("Payment Initialized", body);
      res.status(200).json(body);
    }
  });
};

const VerifyPayment = (req, res) => {
  const form = {
    ref: req.body.externalId,
    access_token: req.body.access_token,
  };
  verifyPayment(form, (error, body) => {
    // console.log("======verifycontroller==========",JSON.parse(body));
    if (error) {
      //handle errors appropriately
      console.log("======verifycontroller error==========", error);
       res.status(500).json(error);
    } else {
      const _body = JSON.parse(body);
      console.log("======verifycontroller response success==========");
      if (_body.status == "SUCCESSFUL") {
        const data = {
          amount: _body.amount,
          MSISDN: _body.payer.partyId,
          message: _body.payeeNote,
          paymentRef: _body.externalId,
          paymentStatus: _body.status,
        };
        console.log("======verifycontroller Req to Pay success==========", _body);

        res.status(200).json(data);
       
      } else {
        console.log("=====verifycontroller Req to Pay failed=======",_body)
        res.status(400).json(_body);
      }
      // response = JSON.parse(body);
    }
  });
};

const CheckPaymentStatus = (req, res) => {
  console.log("Yet to be implemented");
};

module.exports = { MakePayment, VerifyPayment, CheckPaymentStatus };
