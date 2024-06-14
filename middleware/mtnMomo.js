const request = require("request");
const axios = require("axios");
const mtnMomo = (MTN_BASIC_AUTH,MTN_OCP_COLLECTION_KEY) => {
  const MyBasicAuth = `Basic ${MTN_BASIC_AUTH}`;
  const OCPCollectionKey = MTN_OCP_COLLECTION_KEY;
  const MTN_BASE_URL = 'https://proxy.momoapi.mtn.com';
  console.log("===mysecret===", MyBasicAuth);
  console.log("===OCPCollectionKey===", OCPCollectionKey);

  console.log("Base url", MTN_BASE_URL);
  //sk_test_xxxx to be replaced by your own secret key

  const createAccessToken = (mycallback) => {
    console.log("=======MTNMomo module createAcessToken=====");
    const option = {
      url: `${MTN_BASE_URL}/collection/token/`,
      headers: {
        Authorization: MyBasicAuth,
        "Ocp-Apim-Subscription-Key": OCPCollectionKey,
      },
    };
    const callback = (error, response, body) => {
      console.log("=======MTNMomo module createAcessToken res body=====", body);
      console.log("=======MTNMomo module createAcessToken res error=====", error);

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
    console.log("=====Middleware, initializing Payment====");

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
      //   console.log("====Middleware Payment was initialized", body);
      return mycallback(error, body);
    };
    axios
      .post(url, _form, option)
      .then((response) => {
        // console.log(
        //   "====middleware request to pay post response",
        //   response.statusText
        // );
        const body = {
          statusCode: response.status,
          statusText: response.statusText,
        };
        console.log("===Request to Pay body===", body);
        callback(null, body);
      })
      .catch((error) => {
        console.log("====Request to Pay Error===", error);
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
      // console.log("===Verify Request to Pay Payment body===", body);
      // console.log("===Verify Request to Pay Payment error===", error);
      console.log("===Verify Request to Pay Payment response===", response);

      return mycallback(error, body);
    };
    request(option, callback);
  };

  return { createAccessToken, initializePayment, verifyPayment };
};
module.exports = mtnMomo;
