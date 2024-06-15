const {logger}= require("../utils/logger")
const request = require("request");
const axios = require("axios");
const mtnMomo = (MTN_BASIC_AUTH,MTN_OCP_COLLECTION_KEY) => {
  const MyBasicAuth = `Basic ${MTN_BASIC_AUTH}`;
  const OCPCollectionKey = MTN_OCP_COLLECTION_KEY;
  const MTN_BASE_URL = 'https://proxy.momoapi.mtn.com';

  logger('dadson-momo-stk-basic-auth',MyBasicAuth)
  logger("dadson-momo-stk-OCP-Collection-Key", OCPCollectionKey);
  logger("dadson-momo-stk-base-url", MTN_BASE_URL);

  const createAccessToken = (mycallback) => {
    logger("dadson-momo-stk-create-acess-token","generating.......");
    const option = {
      url: `${MTN_BASE_URL}/collection/token/`,
      headers: {
        Authorization: MyBasicAuth,
        "Ocp-Apim-Subscription-Key": OCPCollectionKey,
      },
    };
    const callback = (error, response, body) => {
      logger("dadson-momo-stk-create-acess-token response", response);
      logger("dadson-momo-stk-create-access-token response body", body);
      logger("dadson-momo-stk-create-acess-token response error", error);

      // const _body = JSON.parse(body);
      return mycallback(error, body);
    };
    request.post(option, callback);
  };

  const initializePayment = (form, mycallback) => {
    const _form = {
      amount: form.amount,
      currency: form.currency,
      externalId: form.externalId,
      payer: {
        partyIdType: "MSISDN",
        partyId: form.payer.partyId,
      },
      payerMessage: form.payerMessage,
      payeeNote: form.payeeNote,
    };
    logger("dadson-momo-stk-request-to-pay","initializing payment request");

    const url = `${MTN_BASE_URL}/collection/v1_0/requesttopay`;
    const option = {
      headers: {
        Authorization: `Bearer ${form.access_token}`,
        "X-Reference-Id": `${form.externalId}`,
        //  "X-Callback-Url":
        // "https://salvagemebackendapi.onrender.com/salvageme/payment/verifyPayment",
        "X-Target-Environment": "mtnghana",
        "Ocp-Apim-Subscription-Key": OCPCollectionKey,
      },
    };
    const callback = (error, body) => {
      return mycallback(error, body);
    };
    axios
      .post(url, _form, option)
      .then((response) => {
         
           logger("dadson-momo-stk-request-to-pay-response", response);

        const body = {
          statusCode: response.status,
          statusText: response.statusText,
        };           logger("dadson-momo-stk-request-to-pay-response-body", body);

        callback(null, body);
      })
      .catch((error) => {
        logger("dadson-momo-stk-request-to-pay-error", error);
        logger("dadson-momo-stk-request-to-pay-error-reponse==",error.response)

        callback(error, null);
      });
  };

  const verifyPayment = (form, mycallback) => {
    const option = {
      url: `${MTN_BASE_URL}/collection/v1_0/requesttopay/${form.ref}`,
      headers: {
        Authorization: `Bearer ${form.access_token}`,
        "X-Target-Environment": "mtnghana",
        "Ocp-Apim-Subscription-Key": OCPCollectionKey,
      },
    };
    const callback = (error, response, body) => {
      logger("dadson-momo-stk-verify-request-to-pay-payment-confirmation-body", body);
      logger("dadson-momo-stk-verify-request-to-pay-payment-confirmation-error", error);
      logger("dadson-momo-stk-verify-request-to-pay-payment-confirmation-response", response);

      return mycallback(error, body);
    };
    request(option, callback);
  };

  return { createAccessToken, initializePayment, verifyPayment };
};
module.exports = mtnMomo;
