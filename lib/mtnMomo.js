const axios = require("axios");

const DEFAULT_BASE_URL = "https://proxy.momoapi.mtn.com";
const DEFAULT_TARGET_ENVIRONMENT = "mtnghana";

class MtnMomo {
  constructor(options = {}) {
    const {
      basicAuth,
      collectionKey,
      baseUrl = DEFAULT_BASE_URL,
      targetEnvironment = DEFAULT_TARGET_ENVIRONMENT,
    } = options;

    if (!basicAuth) throw new Error("basicAuth is required");
    if (!collectionKey) throw new Error("collectionKey is required");

    this.basicAuth = basicAuth.startsWith("Basic ")
      ? basicAuth
      : `Basic ${basicAuth}`;
    this.collectionKey = collectionKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.targetEnvironment = targetEnvironment;
  }

  async createAccessToken() {
    const response = await axios.post(`${this.baseUrl}/collection/token/`, null, {
      headers: {
        Authorization: this.basicAuth,
        "Ocp-Apim-Subscription-Key": this.collectionKey,
      },
    });
    return response.data;
  }

  async initializePayment({
    amount,
    externalId,
    payer,
    payerMessage,
    payeeNote,
    accessToken,
    currency = "GHS",
  }) {
    if (!accessToken) throw new Error("accessToken is required");
    if (!externalId) throw new Error("externalId is required");
    if (!payer || !payer.partyId) throw new Error("payer.partyId is required");

    const response = await axios.post(
      `${this.baseUrl}/collection/v1_0/requesttopay`,
      {
        amount,
        currency,
        externalId,
        payer: {
          partyIdType: payer.partyIdType || "MSISDN",
          partyId: payer.partyId,
        },
        payerMessage,
        payeeNote,
      },
      { headers: this.#paymentHeaders(accessToken, externalId) },
    );

    return { statusCode: response.status, statusText: response.statusText };
  }

  async verifyPayment({ externalId, accessToken }) {
    if (!accessToken) throw new Error("accessToken is required");
    if (!externalId) throw new Error("externalId is required");

    const response = await axios.get(
      `${this.baseUrl}/collection/v1_0/requesttopay/${encodeURIComponent(externalId)}`,
      { headers: this.#paymentHeaders(accessToken) },
    );
    return response.data;
  }

  #paymentHeaders(accessToken, referenceId) {
    return {
      Authorization: `Bearer ${accessToken}`,
      ...(referenceId ? { "X-Reference-Id": referenceId } : {}),
      "X-Target-Environment": this.targetEnvironment,
      "Ocp-Apim-Subscription-Key": this.collectionKey,
    };
  }
}

module.exports = MtnMomo;